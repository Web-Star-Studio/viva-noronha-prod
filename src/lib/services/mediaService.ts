import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useEffect, useRef } from "react";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { uploadFiles } from "@/lib/uploadthing";

// Type definitions for media files
export type Media = {
  _id: Id<"media">;
  _creationTime?: number;
  storageId: string;
  fileName: string;
  fileType: string;
  fileSize: bigint;
  description?: string;
  category?: string;
  height?: bigint;
  width?: bigint;
  uploadedBy: Id<"users">;
  isPublic: boolean;
  tags?: string[];
  url: string;
};

export type MediaUpload = {
  file: File;
  description?: string;
  category?: string;
  isPublic: boolean;
  tags?: string[];
};

// Hook to get all media files with URL verification
export function useMedia() {
  const media = useQuery(api.domains.media.queries.getAllMedia);
  useVerifyMediaCollection(media);

  return {
    media,
    isLoading: media === undefined
  };
}

// Hook to get media by category
export function useMediaByCategory(category: string | null) {
  const media = useQuery(
    api.domains.media.queries.getMediaByCategory,
    category ? { category } : "skip"
  );
  useVerifyMediaCollection(media);
  
  return {
    media,
    isLoading: category !== null && media === undefined
  };
}

// Hook to get media by user
export function useMediaByUser(userId: Id<"users">) {
  const media = useQuery(api.domains.media.queries.getByUser, { userId });
  useVerifyMediaCollection(media);
  
  return {
    media: media as Media[] | undefined,
    isLoading: media === undefined
  };
}

// Hook to get a single media file by ID
export function useMediaById(id: Id<"media"> | null) {
  const media = useQuery(api.domains.media.queries.getMediaById, id ? { id } : "skip");
  useVerifyMediaCollection(media ? [media] : undefined);
  
  return {
    media,
    isLoading: id !== null && media === undefined
  };
}

function useVerifyMediaCollection(mediaItems?: Media[] | null) {
  const refreshUrl = useMutation(api.domains.media.mutations.refreshMediaUrl);
  const verifiedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const abortController = new AbortController();
    const verifiedIds = verifiedIdsRef.current;

    if (!mediaItems || mediaItems.length === 0) {
      verifiedIds.clear();
      return;
    }

    const pendingItems = mediaItems.filter((media) => {
      if (!media?._id) {
        return false;
      }

      const mediaId = String(media._id);
      if (verifiedIds.has(mediaId)) {
        return false;
      }

      verifiedIds.add(mediaId);
      return true;
    });

    if (pendingItems.length === 0) {
      return;
    }

    void (async () => {
      for (const media of pendingItems) {
        if (abortController.signal.aborted) {
          return;
        }

        if (!media._id) {
          continue;
        }

        try {
          const response = await fetch(media.url, {
            method: "HEAD",
            signal: abortController.signal,
          });

          if (abortController.signal.aborted) {
            return;
          }

          if (!response.ok) {
            console.log(`Atualizando URL para mídia ${media._id} (${media.fileName})`);
            const newUrl = await refreshUrl({ id: media._id });
            if (abortController.signal.aborted) {
              return;
            }
            if (newUrl === null) {
              verifiedIds.delete(String(media._id));
              console.log(`Mídia ${media._id} foi excluída, ignorando atualização de URL`);
            }
          }
        } catch (error) {
          if (abortController.signal.aborted) {
            return;
          }

          console.log(`Erro ao verificar URL para mídia ${media._id}, atualizando...`, error);
          try {
            const newUrl = await refreshUrl({ id: media._id });
            if (abortController.signal.aborted) {
              return;
            }
            if (newUrl === null) {
              verifiedIds.delete(String(media._id));
              console.log(`Mídia ${media._id} foi excluída, ignorando atualização de URL`);
            }
          } catch (refreshError) {
            console.log(`Erro ao atualizar URL para mídia ${media._id}:`, refreshError);
          }
        }
      }
    })();

    return () => {
      abortController.abort();
      verifiedIds.clear();
    };
  }, [mediaItems, refreshUrl]);
}

// Hook to upload a media file
export function useUploadMedia() {
  const { user } = useCurrentUser();
  const storeMedia = useMutation(api.domains.media.mutations.createMedia);

  return async ({
    file,
    description,
    category,
    isPublic,
    tags,
  }: {
    file: File;
    description?: string;
    category?: string;
    isPublic?: boolean;
    tags?: string[];
  }) => {
    if (!user?._id) {
      throw new Error("Usuário não autenticado");
    }

    const uploadResponse = await uploadFiles("mediaUploader", {
      files: [file],
    });

    const uploadedFile = uploadResponse?.[0];
    if (!uploadedFile) {
      throw new Error("Falha ao fazer upload do arquivo");
    }

    const fileUrl =
      uploadedFile.serverData?.fileUrl ?? uploadedFile.ufsUrl ?? uploadedFile.url;
    const fileKey = uploadedFile.serverData?.fileKey ?? uploadedFile.key;
    const fileNameFromServer = uploadedFile.serverData?.fileName ?? uploadedFile.name;
    const fileTypeFromServer = uploadedFile.serverData?.fileType ?? uploadedFile.type;
    const fileSizeFromServer = uploadedFile.serverData?.fileSize ?? uploadedFile.size;

    return await storeMedia({
      storageId: fileKey,
      fileName: fileNameFromServer ?? file.name,
      fileType: fileTypeFromServer ?? file.type,
      fileSize: BigInt(fileSizeFromServer ?? file.size),
      description,
      category,
      uploadedBy: user._id,
      isPublic: isPublic ?? true,
      tags,
      fileUrl,
    });
  };
}

// Hook to get Convex user ID from Clerk ID
export function useGetConvexUserId() {
  return async (clerkId: string): Promise<Id<"users"> | null> => {
    // Use a direct API call to Convex
    try {
      // Create a route that our client code can call
      const response = await fetch(`/api/get-user-id?clerkId=${encodeURIComponent(clerkId)}`);
      if (!response.ok) {
        throw new Error(`Failed to get user ID: ${response.statusText}`);
      }
      const data = await response.json();
      return data.userId as Id<"users">;
    } catch (error) {
      console.error('Error getting Convex user ID:', error);
      return null;
    }
  };
}

// Hook to delete a media file
export function useDeleteMedia() {
  const deleteMedia = useMutation(api.domains.media.mutations.deleteMedia);

  return async (id: Id<"media">) => {
    return await deleteMedia({ id });
  };
}

// Hook to update media metadata
export function useUpdateMedia() {
  const updateMedia = useMutation(api.domains.media.mutations.updateMedia);

  return async ({
    id,
    description,
    category,
    isPublic,
    tags,
  }: {
    id: Id<"media">;
    description?: string;
    category?: string;
    isPublic?: boolean;
    tags?: string[];
  }) => {
    return await updateMedia({
      id,
      description,
      category,
      isPublic,
      tags,
    });
  };
}

// Hook to get media URL
export function useMediaUrl(storageId: string | null) {
  const url = useQuery(
    api.domains.media.queries.getMediaUrl,
    storageId ? { storageId } : "skip"
  );
  return {
    url,
    isLoading: storageId !== null && url === undefined,
  };
}

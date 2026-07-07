"use client";

import { Heart, Link as LinkIcon, Share2 } from "lucide-react";
import { useState } from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { toast } from "sonner";

import { toggleLike } from "@/actions/categories-actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ArticleActionsProps {
  articleId: string;
  initialLikes: number;
  initialIsLiked: boolean;
  title: string;
  url: string;
}

export function ArticleActions({
  articleId,
  initialLikes,
  initialIsLiked,
  title,
  url,
}: ArticleActionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    try {
      setIsLoading(true);
      const result = await toggleLike(articleId);
      setIsLiked(result.liked);
      setLikes((prev) => (result.liked ? prev + 1 : prev - 1));
    } catch {
      toast.error("Veuillez vous connecter pour aimer cet article.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success("Lien copié dans le presse-papier !");
  };

  return (
    <div className="flex items-center gap-1 bg-black/50 p-1 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-1.5 text-white hover:bg-white/10 hover:text-white",
          isLiked && "text-primary hover:text-primary"
        )}
      >
        <Heart className={cn("size-4", isLiked && "fill-current")} />
        <span className="text-xs font-medium">{likes}</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 hover:text-white"
          >
            <Share2 className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="cursor-pointer">
            <FacebookShareButton
              url={url}
              title={title}
              className="flex w-full items-center gap-2"
            >
              <FacebookIcon size={20} round />
              <span>Facebook</span>
            </FacebookShareButton>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <TwitterShareButton
              url={url}
              title={title}
              className="flex w-full items-center gap-2"
            >
              <TwitterIcon size={20} round />
              <span>Twitter</span>
            </TwitterShareButton>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <WhatsappShareButton
              url={url}
              title={title}
              className="flex w-full items-center gap-2"
            >
              <WhatsappIcon size={20} round />
              <span>WhatsApp</span>
            </WhatsappShareButton>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={copyToClipboard}
          >
            <LinkIcon className="size-4" />
            <span>Copier le lien</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

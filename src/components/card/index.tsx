import React from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { Button, buttonVariants } from "../ui/button";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Badge } from "../ui/badge";
import { Plus, Trash2, Pin, Edit3, RotateCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import Link from "next/link";
import { toast } from "~/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

dayjs.extend(relativeTime);

type CardProps = RouterOutputs["notes"]["getUserNotes"][number];

const getPriority = (priority: number) => {
  if (priority === 1) return "Medium";
  if (priority === 2) return "High";
  else return "Normal";
};

const getPriorityColor = (priority: number) =>
  priority === 0 ? "secondary" : priority === 1 ? "default" : "destructive";

const Modal = (props: { data: CardProps }) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{props.data.title}</DialogTitle>
        <DialogDescription>
          {!props.data.archived && (
            <span className="text-xs font-bold ">
              {dayjs(props.data.createdAt).fromNow()}
            </span>
          )}
          <span className="flex gap-2 text-xs">
            <Badge variant={getPriorityColor(props.data.priority)}>
              {getPriority(props.data.priority)}
            </Badge>
            {props.data.pinned && <Badge variant={"ok"}>Pinned</Badge>}
          </span>
        </DialogDescription>
      </DialogHeader>
      <div className="max-h-[80vh] overflow-auto">{props.data.content}</div>
    </DialogContent>
  );
};

const Card = (props: { data: CardProps }) => {
  const ctx = api.useContext();

  const revalidate = async () => {
    console.log("revalidating");
    await ctx.notes.invalidate();
  };

  const { mutate: ArchiveNote, isLoading: isArchiving } =
    api.notes.archiveNote.useMutation({
      onSuccess: () => {
        void revalidate();
        toast({
          description: props.data.archived
            ? "Successfully Restored"
            : "Successfully Archived",
          duration: 1200,
        });
      },
    });

  const { mutate: PinNote, isLoading: isPining } =
    api.notes.pinNote.useMutation({
      onSuccess: revalidate,
    });

  const disableCondition = isPining || isArchiving;

  return (
    <Dialog>
      <div className="relative flex h-[20vh] flex-col overflow-hidden rounded-xl  outline outline-1 outline-slate-200">
        <DialogTrigger asChild>
          <Button
            variant="card"
            className="flex flex-1 items-center justify-center p-4 text-3xl font-black "
            disabled={disableCondition}
          >
            {props.data.title}
          </Button>
        </DialogTrigger>
        <span className="absolute left-[10px] top-[10px] flex gap-2">
          <Badge variant={getPriorityColor(props.data.priority)}>
            {getPriority(props.data.priority)}
          </Badge>
          {props.data.pinned && <Badge variant={"ok"}>Pinned</Badge>}
          {props.data.archived && (
            <Badge variant={"destructive"}>Archived</Badge>
          )}
        </span>
        {!props.data.archived && (
          <span className="absolute bottom-[10px] left-[15px] text-xs font-bold ">
            {dayjs(props.data.createdAt).fromNow()}
          </span>
        )}
        <div className="absolute right-[10px] top-[10px] flex gap-2">
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant={!props.data.archived ? "delete" : "ok"}
                disabled={disableCondition}
                onClick={() => {
                  ArchiveNote({
                    id: props.data.id,
                    authorId: props.data.authorId,
                    set: !props.data.archived,
                  });
                }}
              >
                {!props.data.archived ? (
                  <Trash2 size={20} />
                ) : (
                  <RotateCw size={20} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{props.data.archived ? "Restore" : "Archive"}</p>
            </TooltipContent>
          </Tooltip>
          {!props.data.archived && (
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant={"ok"}
                  disabled={disableCondition}
                  onClick={() => {
                    PinNote({
                      id: props.data.id,
                      authorId: props.data.authorId,
                      set: !props.data.pinned,
                    });
                  }}
                >
                  <Pin size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{props.data.pinned ? "Unpin" : "Pin"}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        {!props.data.archived && (
          <div className="absolute bottom-[10px] right-[10px]">
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href={`/note/${props.data.id}`}
                  className={buttonVariants({ variant: "default" })}
                >
                  <Edit3 size={20} />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
      <Modal data={props.data} />
    </Dialog>
  );
};

export const AddCard = (props: { userId: string }) => {
  const ctx = api.useContext();

  const revalidate = async () => {
    await ctx.notes.invalidate();
  };
  const { mutate: CreateNote, isLoading: isCreating } =
    api.notes.createNote.useMutation({
      onSuccess: revalidate,
    });
  return (
    <Button
      disabled={isCreating}
      onClick={() => {
        CreateNote({ authorId: props.userId });
      }}
      variant={"outline"}
      className="h-[100%] min-h-[20vh]"
    >
      <Plus /> <span className="text-lg"> Add Note</span>
    </Button>
  );
};

export default Card;

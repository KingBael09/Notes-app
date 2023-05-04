import { useRouter } from "next/router";
import React, { useState } from "react";
import Head from "next/head";
import { type RouterOutputs, api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "~/components/ui/button";
import Loading from "../../components/loading/index";
import { type NextPage } from "next";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/hooks/use-toast";

type NoteType = RouterOutputs["notes"]["getNote"];

const Note: NextPage = () => {
  const [someFData, setSomeFData] = useState({} as NoteType);
  const router = useRouter();
  const {
    data: NoteData,
    isLoading: isNoteLoading,
    isError: isNoteError,
  } = api.notes.getNote.useQuery(
    {
      noteId: router.query.id as string,
    },
    {
      onSuccess: (data) => {
        setSomeFData(data);
      },
    }
  );

  const { mutate: UpdateNote, isLoading: isSaving } =
    api.notes.updateNote.useMutation({
      onSuccess: () => {
        // alert("Note updated");
        toast({
          title: "Success!",
          description: "Saved Successfully!",
          duration: 1200,
        });
      },
    });

  if (isNoteLoading) return <LoadingPage />;

  if (!NoteData || isNoteError) return <div>Something Went wrong</div>;

  // ! THis shit is temp

  return (
    <>
      <Head>
        <title>Note</title>
      </Head>
      <main className="p-2">
        <div className="flex items-center ">
          <Link className={buttonVariants({ variant: "outline" })} href="/">
            <ChevronLeft /> Back
          </Link>
          <Button
            className="ml-auto gap-2"
            disabled={JSON.stringify(NoteData) === JSON.stringify(someFData)}
            onClick={() => {
              UpdateNote({ noteId: NoteData.id, noteData: someFData });
            }}
          >
            {isSaving && <Loading size={24} />}
            Save
          </Button>
        </div>
        {/* <div> */}
        {/* //! This shit is temporary */}
        <div className="flex h-[90vh] flex-col gap-6 px-10 pt-5">
          <Input
            type="text"
            value={someFData.title}
            onChange={(e) => {
              setSomeFData({ ...someFData, title: e.target.value });
            }}
          />
          {/* <div>{someFData.content}</div> */}
          <Textarea
            // type="text"
            className="flex-1 grow "
            placeholder="Write Some Text here!"
            value={someFData.content}
            onChange={(e) => {
              setSomeFData({ ...someFData, content: e.target.value });
            }}
          />
        </div>
        {/* </div> */}
      </main>
    </>
  );
};

export default Note;

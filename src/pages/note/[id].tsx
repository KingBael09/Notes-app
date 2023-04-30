import { useRouter } from "next/router";
import React from "react";
import Head from "next/head";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "~/components/ui/button";
import Loading from "../../components/loading/index";
import { type NextPage } from "next";

const Note: NextPage = () => {
  const router = useRouter();
  const {
    data: NoteData,
    isLoading: isNoteLoading,
    isError: isNoteError,
  } = api.notes.getNote.useQuery({
    noteId: router.query.id as string,
  });

  const { mutate: UpdateNote, isLoading: isSaving } =
    api.notes.updateNote.useMutation({
      onSuccess: () => {
        alert("Note updated");
      },
    });

  if (isNoteLoading) return <LoadingPage />;

  if (!NoteData) return <div>Something Went wrong</div>;

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
          <Button className="ml-auto gap-2">
            {isSaving && <Loading size={24} />}
            Save
          </Button>
        </div>
        <div>
          <h1>{NoteData.title}</h1>
          <div>{NoteData.content}</div>
        </div>
      </main>
    </>
  );
};

export default Note;

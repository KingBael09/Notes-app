import React from "react";
import { Loader2 } from "lucide-react";

const Loading = (props: { size?: number }) => {
  return (
    <div className="animate-spin">
      <Loader2 size={props.size || 50} />
    </div>
  );
};

export default Loading;

export const FullScreenLoading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loading />
    </div>
  );
};

export const LoadingPage = () => {
  return (
    <div className="absolute inset-0 flex min-h-0 items-center justify-center">
      <Loading />
    </div>
  );
};

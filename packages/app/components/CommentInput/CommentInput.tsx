import {styled} from "@/stitches.config";
import { useStore } from "@/store/store";
import { useRouter } from "next/router";
import { useState, useCallback, Dispatch, SetStateAction } from "react";
import { 
  Button, 
  Input
} from "@cabindao/topo";
import { IComment } from "@/interfaces";
import { useMutation, useQueryClient } from "react-query";
import { useWallet } from "../WalletAuth";

/** Styled components */
const CommentInputWrapper = styled("div", {
  marginTop: "$3"
});

const InputField = styled(Input, {
  flex: "1",
  width: "100%"
});

const SubmitButton = styled(Button, {
  marginTop: "$3"
});

const CancelButton = styled(Button, {
  marginTop: "$3",
  marginLeft: "$2"
});

const CommentInput = ({ postId, setShowComments }: { postId: string,  setShowComments: Dispatch<SetStateAction<boolean>>}) => {
  const router = useRouter();
  const { currentProfile } = useStore();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useWallet();

  const [commentData, setCommentData] = useState<IComment>({
    _id: '',
    text: '',
    postId,
    postedBy: currentProfile.walletAddress,
    created_at: new Date().toISOString(),
    upvotes: 0,
  });


  const { mutate } = useMutation<any, Error, { postId: string }>(
    async ({ postId }) => {
      return await fetch(`/api/comment/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });
    },
    {
      onSuccess: () => {
        setShowComments(false);
        queryClient.invalidateQueries(["comments", postId]);
      },
    }
  );

  const submitCommentHandler = useCallback(async () => {
    if (isAuthenticated) {
      return mutate({ postId });
    } else {
      alert("Please sign-in to comment");
    }
  }, [ isAuthenticated, mutate, postId ]);

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentData({
      ...commentData,
      text: e.target.value
    })
  };

  return (
    <CommentInputWrapper>
      <InputField
        placeholder={"Your comment"}
        onChange={(e) => onInput(e)}
        />
      <SubmitButton 
        onClick={submitCommentHandler}
        tone="wheat"
      >
        Submit
      </SubmitButton>
      <CancelButton 
        type="secondary"
        onClick={() => setShowComments(false)}
      >
        Cancel
      </CancelButton>
    </CommentInputWrapper>
  );
};

export default CommentInput;

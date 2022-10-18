import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import Post from "../models/Post";
import Thread from "../models/Thread";
import { useStore } from "../stores";
import Avatar from "./Avatar";
import TimeSince from "./TimeSince";

type Props = {
  post: Post;
  thread?: Thread;
};

const PostCard: React.FC<Props> = ({
  post,
  thread,
}) => {
  const store = useStore();
  const userPk = store.accountsStore.authenticated_user?.pk;
  const token = store.accountsStore.token;

  const handleDelete = async () => {
    if (thread) {
      await thread.deletePost(post.pk, token);
    }
  };
 
  return (
    <div className="flex gap-5 my-7">
      {/* User Avatar */}
      <Avatar link={post.authorAvatarURL} />

      {/* Post Info */}
      <div className="flex flex-col">
        <div className="flex flex-col flex-grow ">
          <div>
            <Link to={`/profile/${post.authorPk}`}>
              <span className="text-sm pr-2 font-semibold">
                {post.authorUsername}
              </span>
            </Link>
            <TimeSince date={post.date_created} />
          </div>
          <div>
            <span className="text-lg">{post.message}</span>
          </div>
        </div>
        {userPk === post.authorPk && (
          <div>
            {thread && (
              <button
                className="text-xs  text-gray-400 rounded-md"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(PostCard);

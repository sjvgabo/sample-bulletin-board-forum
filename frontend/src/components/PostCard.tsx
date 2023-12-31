import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Post from "../models/Post";
import Thread from "../models/Thread";
import User from "../models/User";
import { useStore } from "../stores";
import Avatar from "./Avatar";
import TimeSince from "./TimeSince";
import UserHoverCard from "./UserHoverCard";
import getErrorMessage from "../utilities/getErrorMessage";
import ErrorMessage from "./ErrorMessage";
type Props = {
  post: Post;
  thread?: Thread;
};

const PostCard: React.FC<Props> = ({ post, thread }) => {
  const store = useStore();
  const userPk = store.accountsStore.authenticated_user?.pk;
  const token = store.accountsStore.token;
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string>();

  const handleDelete = async () => {
    if (thread) {
      try {
        await store.contentStore.deletePost(post.pk, token, thread.pk);
      } catch (error) {
        setError(getErrorMessage(error));
      }
    }
  };

  const handleMouseOver = () => {
    (async () => {
      await store.accountsStore.fetchUser(post.authorPk);
      setUser(store.accountsStore.currentUser);
    })();
  };

  return (
    <div className="flex gap-5 my-7 z-0">
      {/* User Avatar */}
      <Avatar link={post.authorAvatarURL} />

      {/* Post Info */}
      <div className="flex flex-col relative">
        <div className="flex flex-col flex-grow">
          <div className="flex items-center">
            <Link to={`/profile/${post.authorPk}`}>
              <div onMouseOver={handleMouseOver} className="group">
                <span className="text-md pr-2 font-semibold">
                  {post.authorUsername}
                </span>
                <div className="invisible group-hover:visible absolute top-6 left-0 z-10">
                  <UserHoverCard user={user} />
                </div>
              </div>
            </Link>
            <TimeSince date={post.date_created} />
          </div>
          <div>
            <ReactMarkdown className="text-lg prose prose-slate whitespace-pre-line">
              {post.message}
            </ReactMarkdown>
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
            {error && <ErrorMessage message={error} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(PostCard);

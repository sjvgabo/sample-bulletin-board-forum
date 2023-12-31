import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Avatar from "../components/Avatar";
import BanButton from "../components/BanButton";
import Divider from "../components/Divider";
import EditButton from "../components/EditButton";
import ErrorMessage from "../components/ErrorMessage";
import ImageForm from "../components/ImageForm";
import { Loading } from "../components/Loading";
import Paginator from "../components/Paginator";
import PostCard from "../components/PostCard";
import ProfileDetails from "../components/ProfileDetails";
import ProfileForm from "../components/ProfileForm";
import User from "../models/User";
import { useStore } from "../stores";
import getErrorMessage from "../utilities/getErrorMessage";

const ProfilePage: React.FC = () => {
  const store = useStore();
  const token = store.accountsStore.token;
  let params: { userPk: string };
  params = useParams() as { userPk: string };
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const defaultPageItems = 20;
  const [pageCount, setPageCount] = useState<number>(1);
  const postLength = user?.user_num_posts || 0;
  const handleEditButton = () => {
    setEdit(true);
  };

  const handleConfirmOrCancel = (value: boolean) => {
    setEdit(value);
  };

  const handleBanUser = async () => {
    await user?.banUser(token);
  };

  const handlePageClick = (selectedItem: { selected: number }): void => {
    setPageNumber(selectedItem.selected + 1);
  };

  const handleUser = () => {
    setUser(undefined);
  };

  useEffect(() => {
    setIsOwnProfile(
      parseInt(params.userPk, 10) === store.accountsStore.authenticated_user?.pk
    );

    (async () => {
      try {
        if (!user) {
          await store.accountsStore.fetchUser(parseInt(params.userPk, 10));
        }
        if (user) {
          await store.accountsStore.fetchPosts(user.username, pageNumber);
        }

        if (postLength) {
          setPageCount(Math.ceil(postLength / defaultPageItems));
        }
        setUser(store.accountsStore.currentUser);
        setLoading(false);
      } catch (error) {
        setError(getErrorMessage(error));
      }
    })();
  }, [
    params.userPk,
    store.accountsStore.authenticated_user?.pk,
    edit,
    pageNumber,
    store.accountsStore,
    postLength,
    user,
  ]);

  if (error) return <ErrorMessage message={error} />;
  if (loading) return <Loading />;
  if (user) {
    return (
      <div className="bg-slate-200 h-auto min-h-full p-10">
        <div className="bg-white py-5 px-5">
          {/* Profile header */}
          <div className="flex justify-between">
            <div>
              {error && <ErrorMessage message={error} />}
              <h1 className="text-2xl text-gray-800 font-semibold">
                {user.username} {user.is_banned && "(BANNED)"}
              </h1>
              <h2 className="text-sm text-gray-500">
                {user.first_name} {user.last_name}
              </h2>
              {isOwnProfile && (
                <>
                  <EditButton handleClick={handleEditButton} />

                  <ImageForm userPk={params.userPk} handleUser={handleUser} />
                </>
              )}

              {/* Checks the following so ban button shows up: 1. profile user is not
          banned 2. profile user is not the same as logged user 3. profile user
          is not an administrator 4. logged user is an administrator or a
          moderator */}
              {!user.is_banned &&
                !isOwnProfile &&
                !user.is_administrator &&
                store.accountsStore.authenticated &&
                (store.accountsStore.authenticated_user?.is_moderator ||
                  store.accountsStore.authenticated_user?.is_administrator) && (
                  <BanButton handleClick={handleBanUser} />
                )}
            </div>
            <Avatar link={user.avatar_url} />
          </div>

          <Divider />
          {edit ? (
            <ProfileForm user={user} handleEdit={handleConfirmOrCancel} />
          ) : (
            <ProfileDetails user={user} />
          )}
          <Divider />
          <div>
            <div className="text-lg font-semibold">User Posts</div>
            {/* Post list arranged according to post date descending */}
            {store.accountsStore.currentPosts.length > 0 ? (
              <div>
                {store.accountsStore.currentPosts.map((post) => (
                  <PostCard key={post.pk} post={post} />
                ))}
              </div>
            ) : (
              <div>No posts yet</div>
            )}
            <Paginator
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            />
          </div>
        </div>
      </div>
    );
  }
  return <div></div>;
};

export default observer(ProfilePage);

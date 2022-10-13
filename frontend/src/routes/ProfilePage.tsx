import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useParams } from "react-router-dom";
import BanButton from "../components/BanButton";
import Divider from "../components/Divider";
import EditButton from "../components/EditButton";
import { Loading } from "../components/Loading";
import PostCard from "../components/PostCard";
import ProfileDetails from "../components/ProfileDetails";
import ProfileForm from "../components/ProfileForm";
import User from "../models/User";
import { useStore } from "../stores";

const ProfilePage: React.FC = () => {
  const store = useStore();
  let params: { userPk: string };
  params = useParams() as { userPk: string };
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const defaultPageItems = 20;
  const [pageCount, setPageCount] = useState<number>(1);
  const postLength = user?.user_posts.length || 0;

  useEffect(() => {
    setIsOwnProfile(
      parseInt(params.userPk) === store.accountsStore.authenticated_user?.pk
    );
    (async () => {
      await store.accountsStore.fetchUser(parseInt(params.userPk));
      await store.accountsStore.fetchPosts(parseInt(params.userPk), pageNumber);
      setUser(store.accountsStore.currentUser);
      if (postLength) {
        setPageCount(Math.ceil(postLength / defaultPageItems));
      }

      setLoading(false);
    })();
  }, [
    params.userPk,
    store.accountsStore.authenticated_user?.pk,
    edit,
    pageNumber,
    store.accountsStore,
    postLength,
  ]);

  const handleEditButton = () => {
    setEdit(true);
  };

  const handleConfirmOrCancel = (value: boolean) => {
    setEdit(value);
  };

  const handleBanUser = async () => {
    await user?.banUser();
  };

  const handlePageClick = (selectedItem: { selected: number }): void => {
    setPageNumber(selectedItem.selected + 1);
  };

  if (loading) <Loading />;
  if (user) {
    return (
      <div className="bg-slate-200 h-auto min-h-full p-10">
        <div className="bg-white py-5 px-5">
          <div className="text-2xl text-gray-800 font-semibold">
            {user.username} {user.is_banned && "(BANNED)"}
          </div>
          <div className="text-sm text-gray-500">
            {user.first_name} {user.last_name}
          </div>
          {isOwnProfile && <EditButton handleClick={handleEditButton} />}
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
                  <PostCard
                    key={post.pk}
                    authorPk={post.authorPk}
                    message={post.message}
                    date={post.date_created}
                    postPk={post.pk}
                    authorUsername={post.authorUsername}
                  />
                ))}
              </div>
            ) : (
              <div>No posts yet</div>
            )}
            <ReactPaginate
              nextLabel="Next >"
              previousLabel="< Prev"
              pageCount={pageCount}
              onPageChange={handlePageClick}
            />
          </div>
        </div>
      </div>
    );
  }
  return <div></div>;
};

export default ProfilePage;

import { observer } from "mobx-react-lite";
import React from "react";
import ReactPaginate from "react-paginate";

type Props = {
  handlePageClick: (selectedItem: { selected: number }) => void;
  pageCount: number;
};
const Paginator: React.FC<Props> = ({handlePageClick, pageCount}) => (
  <ReactPaginate
    nextLabel="Next >"
    previousLabel="< Prev"
    pageCount={pageCount}
    onPageChange={handlePageClick}
    containerClassName="flex justify-center gap-2 my-3"
  />
);

export default observer(Paginator);

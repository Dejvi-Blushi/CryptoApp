import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {buildPageNumbers, cn, ELLIPSIS} from "@/lib/utils";

export default function PaginationC({
  currentPage,
  totalPages,
  hasMorePages
}: Pagination) {
  const pageNumbers = buildPageNumbers(currentPage, totalPages);

  return (
    <Pagination id="coins-pagination">
      <PaginationContent className="pagination-content">
        <PaginationItem className="pagination-control prev">
          <PaginationPrevious
            className={
              currentPage === 1 ? "control-disabled" : "control-button"
            }
            href={`?page=${currentPage > 1 && currentPage - 1}`}
          />
        </PaginationItem>

        <div className="pagination-pages">
          {pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === ELLIPSIS ? (
                <span className="ellipsis">...</span>
              ) : (
                <PaginationLink
                  href={`?page=${page}`}
                  className={cn("page-link", {
                    "page-link-active": currentPage === page
                  })}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </div>

        <PaginationItem className="pagination-control next">
          <PaginationNext
            className={!hasMorePages ? "control-disabled" : "control-button"}
            href={`?page=${!hasMorePages ? currentPage : currentPage + 1}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

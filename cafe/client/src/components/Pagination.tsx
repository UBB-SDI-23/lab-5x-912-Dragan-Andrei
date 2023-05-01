// material ui
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// css
import "../assets/css/pagination.css";

// utils
import { useEffect, useState } from "react";

// Pagination component props
interface PaginationProps {
  page: number;
  pageSize: number;
  totalEntries: number;
  setPage: any;
  setPageSize: any;
  entityName: string;
}

const Pagination = ({ page, pageSize, totalEntries, setPage, setPageSize, entityName }: PaginationProps) => {
  // function to handle page navigation
  const changePage = (value: number) => {
    if (value === -1 && page > 1) setPage((prev: number) => prev - 1);
    else if (value === 1 && pageSize * page < totalEntries) setPage((prev: number) => prev + 1);
  };

  // page indexes
  const [startIdx, setStartIdx] = useState<number[]>([]);
  const [endIdx, setEndIdx] = useState<number[]>([]);
  const [interIdx, setInterIdx] = useState<number[]>([]);

  useEffect(() => {
    if (Math.ceil(totalEntries / pageSize) >= 11) {
      setStartIdx([1, 2, 3, 4, 5]);
      setEndIdx([
        Math.ceil(totalEntries / pageSize) - 4,
        Math.ceil(totalEntries / pageSize) - 3,
        Math.ceil(totalEntries / pageSize) - 2,
        Math.ceil(totalEntries / pageSize) - 1,
        Math.ceil(totalEntries / pageSize),
      ]);

      let localInterIdx = [];

      for (let i = Math.max(5, page - 6); i <= Math.min(Math.ceil(totalEntries / pageSize) - 6, page); i++) {
        localInterIdx.push(i);
      }

      for (let i = page + 1; i <= Math.min(Math.ceil(totalEntries / pageSize) - 6, page + 4); i++) {
        localInterIdx.push(i);
      }

      setInterIdx(localInterIdx);
    } else {
      setStartIdx([]);
      setInterIdx(Array.from(Array(Math.ceil(totalEntries / pageSize)).keys()));
      setEndIdx([]);
    }
  }, [page, pageSize, totalEntries]);

  return (
    <>
      <Box className="pagination-container">
        <Box className="page-selector">
          <ChevronLeftIcon className="change-page-arrow" onClick={() => changePage(-1)}></ChevronLeftIcon>

          {startIdx.length > 0 && (
            <>
              {startIdx.map((idx) => (
                <Typography variant="h5" key={idx} className={page === idx ? "page-number selected-page" : "page-number"} onClick={() => setPage(idx)}>
                  {idx.toString()}
                </Typography>
              ))}
            </>
          )}

          {interIdx.length > 0 ? (
            <>
              {interIdx[0] > 6 && (
                <Typography variant="h5" className="page-number">
                  ...
                </Typography>
              )}
              {interIdx.map((idx) => (
                <Typography variant="h5" key={idx} className={page === idx + 1 ? "page-number selected-page" : "page-number"} onClick={() => setPage(idx + 1)}>
                  {(idx + 1).toString()}
                </Typography>
              ))}
              {interIdx[interIdx.length - 1] < Math.ceil(totalEntries / pageSize) - 6 && (
                <Typography variant="h5" className="page-number">
                  ...
                </Typography>
              )}
            </>
          ) : (
            totalEntries > 0 && (
              <Typography variant="h5" className="page-number">
                ...
              </Typography>
            )
          )}

          {endIdx.length > 0 && (
            <>
              {endIdx.map((idx) => (
                <Typography variant="h5" key={idx} className={page === idx ? "page-number selected-page" : "page-number"} onClick={() => setPage(idx)}>
                  {idx.toString()}
                </Typography>
              ))}
            </>
          )}
          <ChevronRightIcon className="change-page-arrow" onClick={() => changePage(+1)}></ChevronRightIcon>
        </Box>
        <Box className="page-size-selector">
          <Typography variant="h6" mr="8px">
            Show:{" "}
          </Typography>
          <TextField
            select
            variant="standard"
            defaultValue={pageSize}
            value={pageSize}
            onChange={(e) => setPageSize(+e.target.value)}
            className="page-size-textbox"
          >
            <MenuItem value={10}>10 {entityName}</MenuItem>
            <MenuItem value={15}>15 {entityName}</MenuItem>
            <MenuItem value={20}>20 {entityName}</MenuItem>
          </TextField>
        </Box>
      </Box>
    </>
  );
};

export default Pagination;

import { useEffect } from "react";

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | Badminton Stores`;
  }, [title]);
};

export default usePageTitle;

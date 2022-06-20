// 点击其他区域，关闭弹窗
export const handleClickOutside = (
  ref: React.RefObject<HTMLDivElement>,
  callback: () => void
) => {
  const handleClick = (e: any) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };
  document.addEventListener("mousedown", handleClick);
  return () => {
    document.removeEventListener("mousedown", handleClick);
  };
};

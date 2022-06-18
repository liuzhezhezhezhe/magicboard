import React from "react";

import "./index.less";

/**
 * 工具基本样式container
 * @param {React.ReactNode} children 子组件
 * @param {string} className 元素class
 * @param {React.ReactNode} icon 工具图标
 * @param {string} title 工具标题
 * @param {() => void} onClick 工具点击事件
 * @param {() => void} onBlur 失去焦点事件
 */
export interface IToolContainerProps {
  children?: React.ReactNode;
  className?: string;
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  onBlur?: () => void;
}

const Index: React.FC<IToolContainerProps> = (props) => {
  const { children, className, icon, title, onClick, onBlur } = props;
  return (
    <div
      className={`tool-container ${className ? className : ""}`}
      onBlur={onBlur}
    >
      <div className="icon-container" onClick={onClick}>
        {icon}
      </div>
      <span className="tool-title">{title}</span>
      {children}
    </div>
  );
};

export default Index;

import React from 'React';

function LeftNav({ children, curTop, curLeft }){
  const curLeftNav = children && children.find((child) => {
    return child.props.parentKey == curTop;
  });
  return  curLeftNav ? React.cloneElement(curLeftNav, { selectedKeys: [curLeft] }) : <div/>;
}
export default LeftNav;
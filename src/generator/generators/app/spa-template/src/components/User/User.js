'use strict';

import style from './User.less';

const user = (window.GV && window.GV.loginUser) || {};
class User extends React.Component {
  render() {
    const mainPage = `https://work.alibaba-inc.com/work/u/${user.empId}`;
    const avatar = `https://work.alibaba-inc.com/photo/${user.empId}.220x220.jpg`;

    return (
      <a className={style.user} href={mainPage} target="_blank">
        <img src={avatar} />
        { `${user.lastName || ''}(${user.nickNameCn || ''})`}
      </a>
    );
  }
}

User.displayName = 'User';

export default User;

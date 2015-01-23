
/* 회원 관리 테이블 */
create table memberInfo (
	seq int not null auto_increment,
    userid char(50) not null,
    userpwd char(70) not null,
    regdate datetime not null,

    primary key(seq)
 );


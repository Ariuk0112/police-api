DELIMITER $$CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_admin_account`(
	pi_username nvarchar(100),
    pi_passhash nvarchar(100)
)
BEGIN

declare count int unsigned default 0;


if ifnull(pi_username,'')='' then
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'username cannot be empty';
end if;

if ifnull(pi_passhash,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'password cannot be empty';
end if;

select count(1) into count
from t_admins
where a_username=lower(pi_username); 

if count >=1 then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'already exists';
end if;

insert into t_admins ( a_username, a_password )
values ( lower(pi_username), sha2(pi_passhash, 256));
SELECT MAX(a_id) AS a_id FROM t_admins;
end$$DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_child_delete_sub_cat`(
	pi_id int
)
sp:BEGIN
 declare v_id int ;
 
if ifnull(pi_id,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id cannot be empty';
end if;

#
select child_sub_cat_id
into v_id
from t_child_sub_category
where child_sub_cat_id=pi_id
;
if v_id is null then 
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'категори олдсонгүй!';
end if;
delete from t_child_sub_category where child_sub_cat_id = pi_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_cat`(
	pi_name varchar(100),
   pi_name_en varchar(100)
)
sp:BEGIN
 declare v_count int;
if ifnull(pi_name,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'name cannot be empty';
end if;

#
select count(*)
into v_count
from t_category
where cat_name=pi_name
;


if v_count >= 1 then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Category exists!';
END IF;
insert into t_category (cat_name ,cat_name_en) values (pi_name,pi_name_en);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_child_sub_cat`(
	pi_sub_cat_id int,
    pi_name varchar(100)
)
sp:BEGIN
 declare v_count int;
 declare v_id nvarchar(100) ;
if ifnull(pi_sub_cat_id,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id cannot be empty';
end if;

#

select sub_cat_id
into v_id
from t_sub_category
where sub_cat_id=pi_sub_cat_id
;
if v_id is null then 
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Эцэг категори олдсонгүй!';
end if;

insert into t_child_sub_category (sub_cat_id,child_sub_cat_name) values (pi_sub_cat_id ,pi_name);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_feedback_options`(
	pi_name varchar(100)
)
sp:BEGIN
 declare v_count int;
if ifnull(pi_name,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'name cannot be empty';
end if;

#
select count(*)
into v_count
from t_feedback
where f_name=pi_name
;


if v_count >= 1 then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'feedaback exists!';
END IF;
insert into t_feedback (f_name) values (pi_name);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_news`(
pi_img longtext,
 pi_title mediumtext,
 pi_desc mediumtext, 
 pi_content longtext,
 pi_files mediumtext,
 pi_child_sub_cat_id int
)
BEGIN

declare count int unsigned default 0;
declare returnValue text;

if ifnull(pi_title,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'title cannot be empty';
end if;

if ifnull(pi_desc,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'desc cannot be empty';
end if;

if ifnull(pi_child_sub_cat_id,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'category cannot be empty';
end if;

insert into t_news ( n_img, n_title, n_desc, n_content,n_files, sub_cat_id)
values ( pi_img ,
 pi_title ,
 pi_desc , 
 pi_content ,
 pi_files,
 pi_child_sub_cat_id 
);
SELECT MAX(n_id) AS n_id FROM t_news;

end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_man_team`(
pi_img text,
 pi_firstName mediumtext,
 pi_lastName mediumtext, 
 pi_position longtext
)
BEGIN

declare count int unsigned default 0;

if ifnull(pi_img,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'image cannot be empty';
end if;

if ifnull(pi_position,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'position cannot be empty';
end if;

if ifnull(pi_firstName,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'first name cannot be empty';
end if;

if ifnull(pi_lastName,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'last name cannot be empty';
end if;

insert into t_management_team ( man_firstName, man_lastName, man_position, man_img)
values ( pi_firstName ,
 pi_lastName ,
 pi_position , 
 pi_img
);
SELECT MAX(man_id) AS man_id FROM t_management_team;

end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_sub_cat`(
	pi_cat_id int,
    pi_name varchar(100),
    pi_name_en varchar(100)
)
sp:BEGIN
 declare v_count int;
 declare v_id nvarchar(100) ;
if ifnull(pi_name,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'name cannot be empty';
end if;

#

select cat_id
into v_id
from t_category
where cat_id=pi_cat_id
;
if v_id is null then 
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Эцэг категори олдсонгүй!';
end if;

select count(*)
into v_count
from t_sub_category
where sub_cat_name=pi_name
;


if v_count >= 1 then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Бүртгэлтэй байна!';
END IF;

insert into t_sub_category (cat_id,sub_cat_name , sub_cat_name_en) values (pi_cat_id ,pi_name,pi_name_en);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_r_type`(
pi_img mediumtext,
 pi_name mediumtext

)
BEGIN

declare count int unsigned default 0;
declare returnValue text;

if ifnull(pi_name,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'name cannot be empty';
end if;

insert into  t_report_type( type_img, type_name)
values ( pi_img ,
 pi_name 
);
SELECT MAX(type_id) AS type_id FROM t_report_type;

end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_user_account`(
	pi_phone nvarchar(100),
    pi_otp nvarchar(100)
)
BEGIN

declare count int unsigned default 0;


if ifnull(pi_phone,'')='' then
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'pi_phone cannot be empty';
end if;

if ifnull(pi_otp,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'pi_otp cannot be empty';
end if;

select count(1) into count
from t_users
where u_phone=lower(pi_phone); 

if count >=1 then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'alreadt exists';
end if;

insert into t_users ( u_phone, u_phoneOtp )
values ( pi_phone, pi_otp);
end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_child_sub_cat`(
	pi_id int
)
sp:BEGIN
 declare v_id int ;
 
if ifnull(pi_id,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id cannot be empty';
end if;

#
select child_sub_cat_id
into v_id
from t_child_sub_category
where child_sub_cat_id=pi_id
;
if v_id is null then 
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'категори олдсонгүй!';
end if;
delete from t_child_sub_category where child_sub_cat_id = pi_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_cat`(
	pi_id int
)
sp:BEGIN
 declare v_id int ;
 
if ifnull(pi_id,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id cannot be empty';
end if;

#
select cat_id
into v_id
from t_category
where cat_id=pi_id
;
if v_id is null then 
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'категори олдсонгүй!';
end if;
delete from t_category where cat_id = pi_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_news`(
	pi_id int
)
sp:BEGIN
 declare v_id int ;
 declare v_img text;
 declare v_files text;
if ifnull(pi_id,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id cannot be empty';
end if;

#
select n_id
into v_id
from t_news
where n_id=pi_id
;
if v_id is null then 
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'мэдээ олдсонгүй!';
end if;
select n_img,n_files into v_img ,v_files from t_news  where n_id = pi_id ;
delete from t_news where n_id = pi_id;
select v_img as n_img , v_files as n_files;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_sub_cat`(
	pi_id int
)
sp:BEGIN
 declare v_id int ;
 
if ifnull(pi_id,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id cannot be empty';
end if;

#
select sub_cat_id
into v_id
from t_sub_category
where sub_cat_id=pi_id
;
if v_id is null then 
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'категори олдсонгүй!';
end if;
delete from t_sub_category where sub_cat_id = pi_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_filter_crime_subtype`(
pi_sub_type varchar(200),
pi_skip int,
pi_limit int,
pi_sort int
)
BEGIN

declare count int unsigned default 0;
declare start int ;
set start = pi_skip-1;
if ifnull(pi_sub_type,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'sub type cannot be empty';
end if;
select * from t_crime
left join t_crime_type on t_crime.c_type = t_crime_type.type_name 
left join t_crime_sub_type on t_crime.c_sub_type_name = t_crime_sub_type.c_sub_type_name where t_crime.c_sub_type_name = pi_sub_type limit start,pi_limit;
end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_filter_crime_type`(
pi_type varchar(100),
pi_skip int,
pi_limit int,
pi_sort int
)
BEGIN

declare count int unsigned default 0;
declare start int ;
set start = pi_skip-1;

if ifnull(pi_type,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'type cannot be empty';
end if;
select * from t_crime
left join t_crime_type on t_crime.c_type = t_crime_type.type_name  where t_crime.c_type=pi_type limit start,pi_limit;
end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_filter_news_cat_id`(
pi_cat_id int,
pi_skip int,
pi_limit int,
pi_sort int
)
BEGIN

declare count int unsigned default 0;
declare start int ;
set start = pi_skip-1;

if ifnull(pi_cat_id,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'child_sub_cat_id cannot be empty';
end if;
select n_id, n_img, n_title, n_desc, n_content, n_viewcount, createdAt,t_category.cat_id
,cat_name from t_news
inner join t_sub_category on t_news.sub_cat_id = t_sub_category.sub_cat_id 
inner join t_category on t_sub_category.cat_id = t_category.cat_id where t_category.cat_id = pi_cat_id limit start,pi_limit;
end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_filter_news_child_sub_cat_id`(
pi_child_sub_cat_id int,
pi_skip int,
pi_limit int,
pi_sort int
)
BEGIN

declare count int unsigned default 0;

declare start int ;
set start = pi_skip-1;

if ifnull(pi_child_sub_cat_id,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'child_sub_cat_id cannot be empty';
end if;
select n_id, n_img, n_title, n_desc, n_content, n_viewcount, createdAt,t_news.child_sub_cat_id
,child_sub_cat_name from t_news inner join 
t_child_sub_category on t_news.child_sub_cat_id = t_child_sub_category.child_sub_cat_id 
where t_child_sub_category.child_sub_cat_id = pi_child_sub_cat_id  limit start,pi_limit;
end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_filter_news_sub_cat_id`(
pi_sub_cat_id int,
pi_skip int,
pi_limit int,
pi_sort int
)
BEGIN

declare count int unsigned default 0;
declare start int ;
set start = pi_skip-1;

if ifnull(pi_sub_cat_id,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'sub_cat_id cannot be empty';
end if;select n_id, n_img, n_title, n_desc, n_content, n_viewcount, createdAt,t_sub_category.sub_cat_id
,sub_cat_name from t_news inner join 
t_sub_category on t_news.sub_cat_id =t_sub_category.sub_cat_id
where t_sub_category.sub_cat_id = pi_sub_cat_id limit start,pi_limit;
end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_filter_reports_typeId`(
pi_type varchar(100),
pi_skip int,
pi_limit int,
pi_sort int
)
BEGIN

declare count int unsigned default 0;
declare start int ;
set start = pi_skip-1;
SELECT * FROM data_police.t_user_reports left join t_report_type on t_user_reports.type_id = t_report_type.type_id where t_status = 0 and t_report_type.type_id = pi_type limit start,pi_limit;
end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_filter_reports_typeName`(
pi_type varchar(100),
pi_skip int,
pi_limit int,
pi_sort int
)
BEGIN

declare count int unsigned default 0;
declare start int ;
set start = pi_skip-1;
SELECT * FROM data_police.t_user_reports left join t_report_type on t_user_reports.type_id = t_report_type.type_id where t_status = 0 and t_report_type.type_name = pi_type limit start,pi_limit;
end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_news_img`(
pi_id int,
pi_img longtext,
pi_files mediumtext
)
BEGIN

declare v_id int;

if ifnull(pi_id,'')='' then
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id cannot be empty';
end if;


if ifnull(pi_img,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'img cannot be empty';
end if;

select n_id
into v_id
from t_news
where n_id=pi_id
;

if v_id is null then 
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Мэдээ олдсонгүй!';
end if;

update t_news set n_img = pi_img, n_files=pi_files where n_id = pi_id  ; 

end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_login_admin`(
	pi_username varchar(100),
    pi_passhash varchar(100)
)
sp:BEGIN

declare v_username varchar(100);
declare v_passhash varchar(100);
declare v_id int;
#

if ifnull(pi_username,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'username cannot be empty';
end if;

if ifnull(pi_passhash,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'password cannot be empty';
end if;

#
select a_id, a_username, a_password
into v_id, v_username, v_passhash
from t_admins
where a_username=pi_username
limit 1
;


if v_username is null then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'not found';
END IF;

if v_passhash <> sha2(pi_passhash, 256) then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'wrong password';
END IF;
select a_id from t_admins where a_id = v_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_login_user`(
	pi_phone nvarchar(100),
    pi_otp nvarchar(100)
)
BEGIN

declare v_id nvarchar(100) ;


if ifnull(pi_phone,'')='' then
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'pi_phone cannot be empty';
end if;

if ifnull(pi_otp,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'pi_otp cannot be empty';
end if;

select u_id into v_id
from t_users
where u_phone=lower(pi_phone); 

if v_id is null then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Бүртгэлгүй байна';
end if;
update t_users set u_phoneOtp = pi_otp ,u_isAccountVerified = true where u_id = v_id ;

end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_show_crime`(
pi_skip int,
pi_limit int,
pi_sort int
)
BEGIN

declare count int unsigned default 0;
declare start int ;
set start = pi_skip-1;

select * from t_crime
left join t_crime_type on t_crime.c_type = t_crime_type.type_name 
left join t_crime_sub_type on t_crime.c_sub_type_name = t_crime_sub_type.c_sub_type_name  limit start,pi_limit;
end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_show_reports`(
pi_skip int,
pi_limit int,
pi_sort int
)
BEGIN

declare count int unsigned default 0;
declare start int ;
set start = pi_skip-1;
SELECT * FROM data_police.t_user_reports left join t_report_type on t_user_reports.type_id = t_report_type.type_id where t_status = 0 limit start,pi_limit;
end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_submit_feedback`(
	pi_f_id int
)
sp:BEGIN
 declare v_count int;
 declare v_id int;
 declare v_u_id int;
if ifnull(pi_f_id,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'feedback id cannot be empty';
end if;

#
select f_id
into v_id
from t_feedback
where f_id=pi_f_id
;
if v_id is null then 
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'feedback олдсонгүй!';
end if;

#
select f_count
into v_count
from t_feedback
where f_id=pi_f_id
;
update t_feedback set f_count=v_count+1 where f_id = pi_f_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_submit_report`(
pi_r_id text, 
pi_dep_name varchar(200),
 pi_c_type varchar(100),
 pi_c_sub_type_name mediumtext,
 pi_c_date mediumtext, 
 pi_c_longitude longtext,
 pi_c_latitude longtext,
 pi_c_is_family_violence varchar(10),
 pi_is_imported varchar(10)
)
BEGIN

declare count int unsigned default 0;
declare returnValue text;

if ifnull(pi_dep_name,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'dep_name cannot be empty';
end if;

if ifnull(pi_c_type,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'c_type cannot be empty';
end if;

if ifnull(pi_c_sub_type_name,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'c_sub_type_name cannot be empty';
end if;

if ifnull(pi_c_date,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'date cannot be empty';
end if;

if ifnull(pi_c_longitude,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'c_longitude cannot be empty';
end if;

if ifnull(pi_c_latitude,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'c_latitude cannot be empty';
end if;

if ifnull(pi_c_is_family_violence,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'c_is_family_violence cannot be empty';
end if;

if ifnull(pi_is_imported,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'is_imported cannot be empty';
end if;

insert into t_crime (dep_name,c_type,c_sub_type_name,
c_date,c_longitude,
c_latitude,c_is_family_violence,is_imported)
 values ( pi_dep_name ,
 pi_c_type ,
 pi_c_sub_type_name , 
 pi_c_date ,
 pi_c_longitude,
 pi_c_latitude, pi_c_is_family_violence ,pi_is_imported
);
update t_user_reports set t_status = 2 where r_id = pi_r_id;
SELECT MAX(c_id) AS c_id FROM t_crime;
end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_cat`(
	pi_id int,
	pi_name varchar(100),
    pi_cat_name_en varchar(100)
)
sp:BEGIN
 declare v_count int;
 declare v_id nvarchar(100) ;
 
if ifnull(pi_name,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'name cannot be empty';
end if;

#
select cat_id
into v_id
from t_category
where cat_id=pi_id
;
if v_id is null then 
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'категори олдсонгүй!';
end if;
update t_category set cat_name = pi_name ,cat_name_en=pi_cat_name_en  where cat_id = pi_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_child_sub_cat`(
	pi_child_cat_id int,
    pi_sub_cat_id int,
    pi_name varchar(100)
)
sp:BEGIN
 declare v_count int;
 declare v_id int ;
 declare v_id1 int ;

#

select sub_cat_id
into v_id
from t_sub_category
where sub_cat_id=pi_sub_cat_id
;
if v_id is null then 
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Эцэг категори олдсонгүй!';
end if;

select child_sub_cat_id
into v_id1
from t_child_sub_category
where child_sub_cat_id=pi_child_cat_id
;
if v_id1 is null then 
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'категори олдсонгүй!';
end if;

select  child_sub_cat_id ,count(*) as count
into v_id, v_count
from t_child_sub_category
where child_sub_cat_name=pi_name group by child_sub_cat_id
;

update t_child_sub_category set sub_cat_id = pi_sub_cat_id, child_sub_cat_name=pi_name where child_sub_cat_id = pi_child_cat_id  ; 
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_news`(
pi_id int,
pi_img longtext,
 pi_title mediumtext,
 pi_desc mediumtext, 
 pi_content longtext,
 pi_child_sub_cat_id int,
 pi_n_files mediumtext
)
BEGIN

declare v_id int;

if ifnull(pi_id,'')='' then
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id cannot be empty';
end if;


if ifnull(pi_title,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'title cannot be empty';
end if;

if ifnull(pi_desc,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'desc cannot be empty';
end if;

if ifnull(pi_child_sub_cat_id,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'category cannot be empty';
end if;

select n_id
into v_id
from t_news
where n_id=pi_id
;

if v_id is null then 
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Мэдээ олдсонгүй!';
end if;

update t_news set n_img = pi_img, n_title=pi_title ,n_desc=pi_desc, n_content=pi_content ,sub_cat_id=pi_child_sub_cat_id , n_files = pi_n_files where n_id = pi_id  ; 

end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_user_login`(
	pi_phone nvarchar(100),
    pi_otp nvarchar(100)
)
BEGIN

declare v_id nvarchar(100) ;


if ifnull(pi_phone,'')='' then
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'pi_phone cannot be empty';
end if;

if ifnull(pi_otp,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'pi_otp cannot be empty';
end if;

select u_id into v_id
from t_users
where u_phone=lower(pi_phone); 

if v_id is null then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Бүртгэлгүй байна';
end if;
update t_users set u_phoneOtp = pi_otp ,u_isAccountVerified = true where u_id = v_id ;

end$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_sub_cat`(
	pi_cat_id int,
    pi_sub_cat_id int,
    pi_name varchar(100),
      pi_name_en varchar(100)
)
sp:BEGIN
 declare v_count int;
 declare v_id nvarchar(100) ;

#

select cat_id
into v_id
from t_category
where cat_id=pi_cat_id
;
if v_id is null then 
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Эцэг категори олдсонгүй!';
end if;

select  sub_cat_id ,count(*) as count
into v_id, v_count
from t_sub_category
where sub_cat_name=pi_name group by sub_cat_id
;

update t_sub_category set cat_id = pi_cat_id, sub_cat_name=pi_name , sub_cat_name_en = pi_name_en where sub_cat_id = pi_sub_cat_id  ; 
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_verifyOtp`(
	pi_phone nvarchar(100),
    pi_otp nvarchar(100)
)
BEGIN
declare v_otp nvarchar(100) ;
declare v_id int unsigned default 0;


if ifnull(pi_phone,'')='' then
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'phone cannot be empty';
end if;

if ifnull(pi_otp,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'otp cannot be empty';
end if;
select u_phoneOtp , u_id into v_otp , v_id
from t_users
where u_phone=lower(pi_phone); 


if v_id is null then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'not found';
END IF;
if v_otp is null then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'login first';
END IF;

if v_otp <> pi_otp then 
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Баталгаажуулах код буруу байна';
end if;

update t_users set u_phoneOtp = null where u_id = v_id ;
end$$
DELIMITER ;

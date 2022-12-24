USE `data_usashopnew`;
DROP procedure IF EXISTS `sp_create_account`;

DELIMITER $$
USE `data_usashopnew`$$
CREATE PROCEDURE `sp_create_account`(
	pi_lname nvarchar(100),
    pi_fname nvarchar(100),
    pi_username varchar(250),
    pi_phonenum varchar(20),
    pi_passhash varchar(100),
    pi_lang varchar(3)
)
sp:BEGIN

declare count int unsigned default 0;


if ifnull(pi_lname,'')='' then
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'lname cannot be empty';
end if;

if ifnull(pi_fname,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'fname cannot be empty';
end if;

if ifnull(pi_username,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'username cannot be empty';
end if;

if ifnull(pi_phonenum,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'phonenum cannot be empty';
end if;

if ifnull(pi_passhash,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'password cannot be empty';
end if;

if ifnull(pi_lang,'')='' then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'lang cannot be empty';
end if;


select count(1) into count
from t_account
where acc_username=lower(pi_username); 

if count >=1 then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'username exists';
end if;

insert into t_account ( acc_lname, acc_fname, acc_username, acc_phonenum, acc_passhash, acc_lang )
values ( pi_lname, pi_fname, lower(pi_username), pi_phonenum, sha2(pi_passhash, 256), upper(pi_lang) );

# and create initial ORDER ( CART status=o )
call sp_create_order(lower(pi_username)); 

END$$

DELIMITER ;

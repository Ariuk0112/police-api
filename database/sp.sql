CREATE PROCEDURE `sp_filter_crime_type`(
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
end
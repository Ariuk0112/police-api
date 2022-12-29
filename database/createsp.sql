DROP PROCEDURE IF EXISTS sp_child_delete_sub_cat;

--
-- Drop procedure `sp_create_admin_account`
--
DROP PROCEDURE IF EXISTS sp_create_admin_account;

--
-- Drop procedure `sp_create_cat`
--
DROP PROCEDURE IF EXISTS sp_create_cat;

--
-- Drop procedure `sp_create_child_sub_cat`
--
DROP PROCEDURE IF EXISTS sp_create_child_sub_cat;

--
-- Drop procedure `sp_create_feedback_options`
--
DROP PROCEDURE IF EXISTS sp_create_feedback_options;

--
-- Drop procedure `sp_create_man_team`
--
DROP PROCEDURE IF EXISTS sp_create_man_team;

--
-- Drop procedure `sp_create_news`
--
DROP PROCEDURE IF EXISTS sp_create_news;

--
-- Drop procedure `sp_create_r_type`
--
DROP PROCEDURE IF EXISTS sp_create_r_type;

--
-- Drop procedure `sp_create_sub_cat`
--
DROP PROCEDURE IF EXISTS sp_create_sub_cat;

--
-- Drop procedure `sp_create_user_account`
--
DROP PROCEDURE IF EXISTS sp_create_user_account;

--
-- Drop procedure `sp_delete_cat`
--
DROP PROCEDURE IF EXISTS sp_delete_cat;

--
-- Drop procedure `sp_delete_child_sub_cat`
--
DROP PROCEDURE IF EXISTS sp_delete_child_sub_cat;

--
-- Drop procedure `sp_delete_news`
--
DROP PROCEDURE IF EXISTS sp_delete_news;

--
-- Drop procedure `sp_delete_sub_cat`
--
DROP PROCEDURE IF EXISTS sp_delete_sub_cat;

--
-- Drop procedure `sp_filter_crime_subtype`
--
DROP PROCEDURE IF EXISTS sp_filter_crime_subtype;

--
-- Drop procedure `sp_filter_crime_type`
--
DROP PROCEDURE IF EXISTS sp_filter_crime_type;

--
-- Drop procedure `sp_filter_news_cat_id`
--
DROP PROCEDURE IF EXISTS sp_filter_news_cat_id;

--
-- Drop procedure `sp_filter_news_child_sub_cat_id`
--
DROP PROCEDURE IF EXISTS sp_filter_news_child_sub_cat_id;

--
-- Drop procedure `sp_filter_news_sub_cat_id`
--
DROP PROCEDURE IF EXISTS sp_filter_news_sub_cat_id;

--
-- Drop procedure `sp_filter_reports_typeId`
--
DROP PROCEDURE IF EXISTS sp_filter_reports_typeId;

--
-- Drop procedure `sp_filter_reports_typeName`
--
DROP PROCEDURE IF EXISTS sp_filter_reports_typeName;

--
-- Drop procedure `sp_insert_news_img`
--
DROP PROCEDURE IF EXISTS sp_insert_news_img;

--
-- Drop procedure `sp_login_admin`
--
DROP PROCEDURE IF EXISTS sp_login_admin;

--
-- Drop procedure `sp_login_user`
--
DROP PROCEDURE IF EXISTS sp_login_user;

--
-- Drop procedure `sp_show_crime`
--
DROP PROCEDURE IF EXISTS sp_show_crime;

--
-- Drop procedure `sp_show_reports`
--
DROP PROCEDURE IF EXISTS sp_show_reports;

--
-- Drop procedure `sp_submit_feedback`
--
DROP PROCEDURE IF EXISTS sp_submit_feedback;

--
-- Drop procedure `sp_submit_report`
--
DROP PROCEDURE IF EXISTS sp_submit_report;

--
-- Drop procedure `sp_update_cat`
--
DROP PROCEDURE IF EXISTS sp_update_cat;

--
-- Drop procedure `sp_update_child_sub_cat`
--
DROP PROCEDURE IF EXISTS sp_update_child_sub_cat;

--
-- Drop procedure `sp_update_news`
--
DROP PROCEDURE IF EXISTS sp_update_news;

--
-- Drop procedure `sp_update_sub_cat`
--
DROP PROCEDURE IF EXISTS sp_update_sub_cat;

--
-- Drop procedure `sp_user_login`
--
DROP PROCEDURE IF EXISTS sp_user_login;

--
-- Drop procedure `sp_verifyOtp`
--
DROP PROCEDURE IF EXISTS sp_verifyOtp;

--
-- Set default database
--
USE data_police;

DELIMITER $$

--
-- Create procedure `sp_verifyOtp`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_verifyOtp (pi_phone nvarchar(100),
pi_otp nvarchar(100))
BEGIN
  DECLARE v_otp nvarchar(100);
  DECLARE v_id int UNSIGNED DEFAULT 0;


  IF IFNULL(pi_phone, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'phone cannot be empty';
  END IF;

  IF IFNULL(pi_otp, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'otp cannot be empty';
  END IF;
  SELECT
    u_phoneOtp,
    u_id INTO v_otp, v_id
  FROM t_users
  WHERE u_phone = LOWER(pi_phone);


  IF v_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'not found';
  END IF;
  IF v_otp IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'login first';
  END IF;

  IF v_otp <> pi_otp THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Баталгаажуулах код буруу байна';
  END IF;

  UPDATE t_users
  SET u_phoneOtp = NULL
  WHERE u_id = v_id;
END
$$

--
-- Create procedure `sp_user_login`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_user_login (pi_phone nvarchar(100),
pi_otp nvarchar(100))
BEGIN

  DECLARE v_id nvarchar(100);


  IF IFNULL(pi_phone, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'pi_phone cannot be empty';
  END IF;

  IF IFNULL(pi_otp, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'pi_otp cannot be empty';
  END IF;

  SELECT
    u_id INTO v_id
  FROM t_users
  WHERE u_phone = LOWER(pi_phone);

  IF v_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Бүртгэлгүй байна';
  END IF;
  UPDATE t_users
  SET u_phoneOtp = pi_otp,
      u_isAccountVerified = TRUE
  WHERE u_id = v_id;

END
$$

--
-- Create procedure `sp_update_sub_cat`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_update_sub_cat (pi_cat_id int,
pi_sub_cat_id int,
pi_name varchar(100),
pi_name_en varchar(100))
sp:
  BEGIN
    DECLARE v_count int;
    DECLARE v_id nvarchar(100);

    #

    SELECT
      cat_id INTO v_id
    FROM t_category
    WHERE cat_id = pi_cat_id
    ;
    IF v_id IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Эцэг категори олдсонгүй!';
    END IF;

    SELECT
      sub_cat_id,
      COUNT(*) AS count INTO v_id, v_count
    FROM t_sub_category
    WHERE sub_cat_name = pi_name
    GROUP BY sub_cat_id
    ;

    UPDATE t_sub_category
    SET cat_id = pi_cat_id,
        sub_cat_name = pi_name,
        sub_cat_name_en = pi_name_en
    WHERE sub_cat_id = pi_sub_cat_id;
  END
  $$

--
-- Create procedure `sp_update_news`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_update_news (pi_id int,
pi_img longtext,
pi_title mediumtext,
pi_desc mediumtext,
pi_content longtext,
pi_child_sub_cat_id int,
pi_n_files mediumtext)
BEGIN

  DECLARE v_id int;

  IF IFNULL(pi_id, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id cannot be empty';
  END IF;


  IF IFNULL(pi_title, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'title cannot be empty';
  END IF;

  IF IFNULL(pi_desc, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'desc cannot be empty';
  END IF;

  IF IFNULL(pi_child_sub_cat_id, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'category cannot be empty';
  END IF;

  SELECT
    n_id INTO v_id
  FROM t_news
  WHERE n_id = pi_id
  ;

  IF v_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Мэдээ олдсонгүй!';
  END IF;

  UPDATE t_news
  SET n_img = pi_img,
      n_title = pi_title,
      n_desc = pi_desc,
      n_content = pi_content,
      sub_cat_id = pi_child_sub_cat_id,
      n_files = pi_n_files
  WHERE n_id = pi_id;

END
$$

--
-- Create procedure `sp_update_child_sub_cat`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_update_child_sub_cat (pi_child_cat_id int,
pi_sub_cat_id int,
pi_name varchar(100))
sp:
  BEGIN
    DECLARE v_count int;
    DECLARE v_id int;
    DECLARE v_id1 int;

    #

    SELECT
      sub_cat_id INTO v_id
    FROM t_sub_category
    WHERE sub_cat_id = pi_sub_cat_id
    ;
    IF v_id IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Эцэг категори олдсонгүй!';
    END IF;

    SELECT
      child_sub_cat_id INTO v_id1
    FROM t_child_sub_category
    WHERE child_sub_cat_id = pi_child_cat_id
    ;
    IF v_id1 IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'категори олдсонгүй!';
    END IF;

    SELECT
      child_sub_cat_id,
      COUNT(*) AS count INTO v_id, v_count
    FROM t_child_sub_category
    WHERE child_sub_cat_name = pi_name
    GROUP BY child_sub_cat_id
    ;

    UPDATE t_child_sub_category
    SET sub_cat_id = pi_sub_cat_id,
        child_sub_cat_name = pi_name
    WHERE child_sub_cat_id = pi_child_cat_id;
  END
  $$

--
-- Create procedure `sp_update_cat`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_update_cat (pi_id int,
pi_name varchar(100),
pi_cat_name_en varchar(100))
sp:
  BEGIN
    DECLARE v_count int;
    DECLARE v_id nvarchar(100);

    IF IFNULL(pi_name, '') = '' THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'name cannot be empty';
    END IF;

    #
    SELECT
      cat_id INTO v_id
    FROM t_category
    WHERE cat_id = pi_id
    ;
    IF v_id IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'категори олдсонгүй!';
    END IF;
    UPDATE t_category
    SET cat_name = pi_name,
        cat_name_en = pi_cat_name_en
    WHERE cat_id = pi_id;
  END
  $$

--
-- Create procedure `sp_submit_report`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_submit_report (pi_r_id text,
pi_dep_name varchar(200),
pi_c_type varchar(100),
pi_c_sub_type_name mediumtext,
pi_c_date mediumtext,
pi_c_longitude longtext,
pi_c_latitude longtext,
pi_c_is_family_violence varchar(10),
pi_is_imported varchar(10))
BEGIN

  DECLARE count int UNSIGNED DEFAULT 0;
  DECLARE returnValue text;

  IF IFNULL(pi_dep_name, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'dep_name cannot be empty';
  END IF;

  IF IFNULL(pi_c_type, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'c_type cannot be empty';
  END IF;

  IF IFNULL(pi_c_sub_type_name, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'c_sub_type_name cannot be empty';
  END IF;

  IF IFNULL(pi_c_date, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'date cannot be empty';
  END IF;

  IF IFNULL(pi_c_longitude, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'c_longitude cannot be empty';
  END IF;

  IF IFNULL(pi_c_latitude, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'c_latitude cannot be empty';
  END IF;

  IF IFNULL(pi_c_is_family_violence, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'c_is_family_violence cannot be empty';
  END IF;

  IF IFNULL(pi_is_imported, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'is_imported cannot be empty';
  END IF;

  INSERT INTO t_crime (dep_name, c_type, c_sub_type_name,
  c_date, c_longitude,
  c_latitude, c_is_family_violence, is_imported)
    VALUES (pi_dep_name, pi_c_type, pi_c_sub_type_name, pi_c_date, pi_c_longitude, pi_c_latitude, pi_c_is_family_violence, pi_is_imported);
  UPDATE t_user_reports
  SET t_status = 2
  WHERE r_id = pi_r_id;
  SELECT
    MAX(c_id) AS c_id
  FROM t_crime;
END
$$

--
-- Create procedure `sp_submit_feedback`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_submit_feedback (pi_f_id int)
sp:
  BEGIN
    DECLARE v_count int;
    DECLARE v_id int;
    DECLARE v_u_id int;
    IF IFNULL(pi_f_id, '') = '' THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'feedback id cannot be empty';
    END IF;

    #
    SELECT
      f_id INTO v_id
    FROM t_feedback
    WHERE f_id = pi_f_id
    ;
    IF v_id IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'feedback олдсонгүй!';
    END IF;

    #
    SELECT
      f_count INTO v_count
    FROM t_feedback
    WHERE f_id = pi_f_id
    ;
    UPDATE t_feedback
    SET f_count = v_count + 1
    WHERE f_id = pi_f_id;
  END
  $$

--
-- Create procedure `sp_show_reports`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_show_reports (pi_skip int,
pi_limit int,
pi_sort int)
BEGIN

  DECLARE count int UNSIGNED DEFAULT 0;
  DECLARE start int;
  SET start = pi_skip - 1;
  SELECT
    *
  FROM data_police.t_user_reports
    LEFT JOIN t_report_type
      ON t_user_reports.type_id = t_report_type.type_id
  WHERE t_status = 0 LIMIT start, pi_limit;
END
$$

--
-- Create procedure `sp_show_crime`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_show_crime (pi_skip int,
pi_limit int,
pi_sort int)
BEGIN

  DECLARE count int UNSIGNED DEFAULT 0;
  DECLARE start int;
  SET start = pi_skip - 1;

  SELECT
    *
  FROM t_crime
    LEFT JOIN t_crime_type
      ON t_crime.c_type = t_crime_type.type_name
    LEFT JOIN t_crime_sub_type
      ON t_crime.c_sub_type_name = t_crime_sub_type.c_sub_type_name LIMIT start, pi_limit;
END
$$

--
-- Create procedure `sp_login_user`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_login_user (pi_phone nvarchar(100),
pi_otp nvarchar(100))
BEGIN

  DECLARE v_id nvarchar(100);


  IF IFNULL(pi_phone, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'pi_phone cannot be empty';
  END IF;

  IF IFNULL(pi_otp, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'pi_otp cannot be empty';
  END IF;

  SELECT
    u_id INTO v_id
  FROM t_users
  WHERE u_phone = LOWER(pi_phone);

  IF v_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Бүртгэлгүй байна';
  END IF;
  UPDATE t_users
  SET u_phoneOtp = pi_otp,
      u_isAccountVerified = TRUE
  WHERE u_id = v_id;

END
$$

--
-- Create procedure `sp_login_admin`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_login_admin (pi_username varchar(100),
pi_passhash varchar(100))
sp:
  BEGIN

    DECLARE v_username varchar(100);
    DECLARE v_passhash varchar(100);
    DECLARE v_id int;
    #

    IF IFNULL(pi_username, '') = '' THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'username cannot be empty';
    END IF;

    IF IFNULL(pi_passhash, '') = '' THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'password cannot be empty';
    END IF;

    #
    SELECT
      a_id,
      a_username,
      a_password INTO v_id, v_username, v_passhash
    FROM t_admins
    WHERE a_username = pi_username
    LIMIT 1
    ;


    IF v_username IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'not found';
    END IF;

    IF v_passhash <> SHA2(pi_passhash, 256) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'wrong password';
    END IF;
    SELECT
      a_id
    FROM t_admins
    WHERE a_id = v_id;
  END
  $$

--
-- Create procedure `sp_insert_news_img`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_insert_news_img (pi_id int,
pi_img longtext,
pi_files mediumtext)
BEGIN

  DECLARE v_id int;

  IF IFNULL(pi_id, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id cannot be empty';
  END IF;


  IF IFNULL(pi_img, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'img cannot be empty';
  END IF;

  SELECT
    n_id INTO v_id
  FROM t_news
  WHERE n_id = pi_id
  ;

  IF v_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Мэдээ олдсонгүй!';
  END IF;

  UPDATE t_news
  SET n_img = pi_img,
      n_files = pi_files
  WHERE n_id = pi_id;

END
$$

--
-- Create procedure `sp_filter_reports_typeName`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_filter_reports_typeName (pi_type varchar(100),
pi_skip int,
pi_limit int,
pi_sort int)
BEGIN

  DECLARE count int UNSIGNED DEFAULT 0;
  DECLARE start int;
  SET start = pi_skip - 1;
  SELECT
    *
  FROM data_police.t_user_reports
    LEFT JOIN t_report_type
      ON t_user_reports.type_id = t_report_type.type_id
  WHERE t_status = 0
  AND t_report_type.type_name = pi_type LIMIT start, pi_limit;
END
$$

--
-- Create procedure `sp_filter_reports_typeId`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_filter_reports_typeId (pi_type varchar(100),
pi_skip int,
pi_limit int,
pi_sort int)
BEGIN

  DECLARE count int UNSIGNED DEFAULT 0;
  DECLARE start int;
  SET start = pi_skip - 1;
  SELECT
    *
  FROM data_police.t_user_reports
    LEFT JOIN t_report_type
      ON t_user_reports.type_id = t_report_type.type_id
  WHERE t_status = 0
  AND t_report_type.type_id = pi_type LIMIT start, pi_limit;
END
$$

--
-- Create procedure `sp_filter_news_sub_cat_id`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_filter_news_sub_cat_id (pi_sub_cat_id int,
pi_skip int,
pi_limit int,
pi_sort int)
BEGIN

  DECLARE count int UNSIGNED DEFAULT 0;
  DECLARE start int;
  SET start = pi_skip - 1;

  IF IFNULL(pi_sub_cat_id, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'sub_cat_id cannot be empty';
  END IF;
  SELECT
    n_id,
    n_img,
    n_title,
    n_desc,
    n_content,
    n_viewcount,
    createdAt,
    t_sub_category.sub_cat_id,
    sub_cat_name
  FROM t_news
    INNER JOIN t_sub_category
      ON t_news.sub_cat_id = t_sub_category.sub_cat_id
  WHERE t_sub_category.sub_cat_id = pi_sub_cat_id LIMIT start, pi_limit;
END
$$

--
-- Create procedure `sp_filter_news_child_sub_cat_id`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_filter_news_child_sub_cat_id (pi_child_sub_cat_id int,
pi_skip int,
pi_limit int,
pi_sort int)
BEGIN

  DECLARE count int UNSIGNED DEFAULT 0;

  DECLARE start int;
  SET start = pi_skip - 1;

  IF IFNULL(pi_child_sub_cat_id, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'child_sub_cat_id cannot be empty';
  END IF;
  SELECT
    n_id,
    n_img,
    n_title,
    n_desc,
    n_content,
    n_viewcount,
    createdAt,
    t_news.child_sub_cat_id,
    child_sub_cat_name
  FROM t_news
    INNER JOIN t_child_sub_category
      ON t_news.child_sub_cat_id = t_child_sub_category.child_sub_cat_id
  WHERE t_child_sub_category.child_sub_cat_id = pi_child_sub_cat_id LIMIT start, pi_limit;
END
$$

--
-- Create procedure `sp_filter_news_cat_id`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_filter_news_cat_id (pi_cat_id int,
pi_skip int,
pi_limit int,
pi_sort int)
BEGIN

  DECLARE count int UNSIGNED DEFAULT 0;
  DECLARE start int;
  SET start = pi_skip - 1;

  IF IFNULL(pi_cat_id, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'child_sub_cat_id cannot be empty';
  END IF;
  SELECT
    n_id,
    n_img,
    n_title,
    n_desc,
    n_content,
    n_viewcount,
    createdAt,
    t_category.cat_id,
    cat_name
  FROM t_news
    INNER JOIN t_sub_category
      ON t_news.sub_cat_id = t_sub_category.sub_cat_id
    INNER JOIN t_category
      ON t_sub_category.cat_id = t_category.cat_id
  WHERE t_category.cat_id = pi_cat_id LIMIT start, pi_limit;
END
$$

--
-- Create procedure `sp_filter_crime_type`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_filter_crime_type (pi_type varchar(100),
pi_skip int,
pi_limit int,
pi_sort int)
BEGIN

  DECLARE count int UNSIGNED DEFAULT 0;
  DECLARE start int;
  SET start = pi_skip - 1;

  IF IFNULL(pi_type, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'type cannot be empty';
  END IF;
  SELECT
    *
  FROM t_crime
    LEFT JOIN t_crime_type
      ON t_crime.c_type = t_crime_type.type_name
  WHERE t_crime.c_type = pi_type LIMIT start, pi_limit;
END
$$

--
-- Create procedure `sp_filter_crime_subtype`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_filter_crime_subtype (pi_sub_type varchar(200),
pi_skip int,
pi_limit int,
pi_sort int)
BEGIN

  DECLARE count int UNSIGNED DEFAULT 0;
  DECLARE start int;
  SET start = pi_skip - 1;
  IF IFNULL(pi_sub_type, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'sub type cannot be empty';
  END IF;
  SELECT
    *
  FROM t_crime
    LEFT JOIN t_crime_type
      ON t_crime.c_type = t_crime_type.type_name
    LEFT JOIN t_crime_sub_type
      ON t_crime.c_sub_type_name = t_crime_sub_type.c_sub_type_name
  WHERE t_crime.c_sub_type_name = pi_sub_type LIMIT start, pi_limit;
END
$$

--
-- Create procedure `sp_delete_sub_cat`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_delete_sub_cat (pi_id int)
sp:
  BEGIN
    DECLARE v_id int;

    IF IFNULL(pi_id, '') = '' THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id cannot be empty';
    END IF;

    #
    SELECT
      sub_cat_id INTO v_id
    FROM t_sub_category
    WHERE sub_cat_id = pi_id
    ;
    IF v_id IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'категори олдсонгүй!';
    END IF;
    DELETE
      FROM t_sub_category
    WHERE sub_cat_id = pi_id;
  END
  $$

--
-- Create procedure `sp_delete_news`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_delete_news (pi_id int)
sp:
  BEGIN
    DECLARE v_id int;
    DECLARE v_img text;
    DECLARE v_files text;
    IF IFNULL(pi_id, '') = '' THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id cannot be empty';
    END IF;

    #
    SELECT
      n_id INTO v_id
    FROM t_news
    WHERE n_id = pi_id
    ;
    IF v_id IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'мэдээ олдсонгүй!';
    END IF;
    SELECT
      n_img,
      n_files INTO v_img, v_files
    FROM t_news
    WHERE n_id = pi_id;
    DELETE
      FROM t_news
    WHERE n_id = pi_id;
    SELECT
      v_img AS n_img,
      v_files AS n_files;
  END
  $$

--
-- Create procedure `sp_delete_child_sub_cat`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_delete_child_sub_cat (pi_id int)
sp:
  BEGIN
    DECLARE v_id int;

    IF IFNULL(pi_id, '') = '' THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id cannot be empty';
    END IF;

    #
    SELECT
      child_sub_cat_id INTO v_id
    FROM t_child_sub_category
    WHERE child_sub_cat_id = pi_id
    ;
    IF v_id IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'категори олдсонгүй!';
    END IF;
    DELETE
      FROM t_child_sub_category
    WHERE child_sub_cat_id = pi_id;
  END
  $$

--
-- Create procedure `sp_delete_cat`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_delete_cat (pi_id int)
sp:
  BEGIN
    DECLARE v_id int;

    IF IFNULL(pi_id, '') = '' THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id cannot be empty';
    END IF;

    #
    SELECT
      cat_id INTO v_id
    FROM t_category
    WHERE cat_id = pi_id
    ;
    IF v_id IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'категори олдсонгүй!';
    END IF;
    DELETE
      FROM t_category
    WHERE cat_id = pi_id;
  END
  $$

--
-- Create procedure `sp_create_user_account`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_create_user_account (pi_phone nvarchar(100),
pi_otp nvarchar(100))
BEGIN

  DECLARE count int UNSIGNED DEFAULT 0;


  IF IFNULL(pi_phone, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'pi_phone cannot be empty';
  END IF;

  IF IFNULL(pi_otp, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'pi_otp cannot be empty';
  END IF;

  SELECT
    count(1) INTO count
  FROM t_users
  WHERE u_phone = LOWER(pi_phone);

  IF count >= 1 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'alreadt exists';
  END IF;

  INSERT INTO t_users (u_phone, u_phoneOtp)
    VALUES (pi_phone, pi_otp);
END
$$

--
-- Create procedure `sp_create_sub_cat`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_create_sub_cat (pi_cat_id int,
pi_name varchar(100),
pi_name_en varchar(100))
sp:
  BEGIN
    DECLARE v_count int;
    DECLARE v_id nvarchar(100);
    IF IFNULL(pi_name, '') = '' THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'name cannot be empty';
    END IF;

    #

    SELECT
      cat_id INTO v_id
    FROM t_category
    WHERE cat_id = pi_cat_id
    ;
    IF v_id IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Эцэг категори олдсонгүй!';
    END IF;

    SELECT
      COUNT(*) INTO v_count
    FROM t_sub_category
    WHERE sub_cat_name = pi_name
    ;


    IF v_count >= 1 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Бүртгэлтэй байна!';
    END IF;

    INSERT INTO t_sub_category (cat_id, sub_cat_name, sub_cat_name_en)
      VALUES (pi_cat_id, pi_name, pi_name_en);
  END
  $$

--
-- Create procedure `sp_create_r_type`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_create_r_type (pi_img mediumtext,
pi_name mediumtext)
BEGIN

  DECLARE count int UNSIGNED DEFAULT 0;
  DECLARE returnValue text;

  IF IFNULL(pi_name, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'name cannot be empty';
  END IF;

  INSERT INTO t_report_type (type_img, type_name)
    VALUES (pi_img, pi_name);
  SELECT
    MAX(type_id) AS type_id
  FROM t_report_type;

END
$$

--
-- Create procedure `sp_create_news`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_create_news (pi_img longtext,
pi_title mediumtext,
pi_desc mediumtext,
pi_content longtext,
pi_files mediumtext,
pi_child_sub_cat_id int)
BEGIN

  DECLARE count int UNSIGNED DEFAULT 0;
  DECLARE returnValue text;

  IF IFNULL(pi_title, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'title cannot be empty';
  END IF;

  IF IFNULL(pi_desc, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'desc cannot be empty';
  END IF;

  IF IFNULL(pi_child_sub_cat_id, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'category cannot be empty';
  END IF;

  INSERT INTO t_news (n_img, n_title, n_desc, n_content, n_files, sub_cat_id)
    VALUES (pi_img, pi_title, pi_desc, pi_content, pi_files, pi_child_sub_cat_id);
  SELECT
    MAX(n_id) AS n_id
  FROM t_news;

END
$$

--
-- Create procedure `sp_create_man_team`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_create_man_team (pi_img text,
pi_firstName mediumtext,
pi_lastName mediumtext,
pi_position longtext)
BEGIN

  DECLARE count int UNSIGNED DEFAULT 0;

  IF IFNULL(pi_img, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'image cannot be empty';
  END IF;

  IF IFNULL(pi_position, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'position cannot be empty';
  END IF;

  IF IFNULL(pi_firstName, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'first name cannot be empty';
  END IF;

  IF IFNULL(pi_lastName, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'last name cannot be empty';
  END IF;

  INSERT INTO t_management_team (man_firstName, man_lastName, man_position, man_img)
    VALUES (pi_firstName, pi_lastName, pi_position, pi_img);
  SELECT
    MAX(man_id) AS man_id
  FROM t_management_team;

END
$$

--
-- Create procedure `sp_create_feedback_options`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_create_feedback_options (pi_name varchar(100))
sp:
  BEGIN
    DECLARE v_count int;
    IF IFNULL(pi_name, '') = '' THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'name cannot be empty';
    END IF;

    #
    SELECT
      COUNT(*) INTO v_count
    FROM t_feedback
    WHERE f_name = pi_name
    ;


    IF v_count >= 1 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'feedaback exists!';
    END IF;
    INSERT INTO t_feedback (f_name)
      VALUES (pi_name);
  END
  $$

--
-- Create procedure `sp_create_child_sub_cat`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_create_child_sub_cat (pi_sub_cat_id int,
pi_name varchar(100))
sp:
  BEGIN
    DECLARE v_count int;
    DECLARE v_id nvarchar(100);
    IF IFNULL(pi_sub_cat_id, '') = '' THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id cannot be empty';
    END IF;

    #

    SELECT
      sub_cat_id INTO v_id
    FROM t_sub_category
    WHERE sub_cat_id = pi_sub_cat_id
    ;
    IF v_id IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Эцэг категори олдсонгүй!';
    END IF;

    INSERT INTO t_child_sub_category (sub_cat_id, child_sub_cat_name)
      VALUES (pi_sub_cat_id, pi_name);
  END
  $$

--
-- Create procedure `sp_create_cat`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_create_cat (pi_name varchar(100),
pi_name_en varchar(100))
sp:
  BEGIN
    DECLARE v_count int;
    IF IFNULL(pi_name, '') = '' THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'name cannot be empty';
    END IF;

    #
    SELECT
      COUNT(*) INTO v_count
    FROM t_category
    WHERE cat_name = pi_name
    ;


    IF v_count >= 1 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Category exists!';
    END IF;
    INSERT INTO t_category (cat_name, cat_name_en)
      VALUES (pi_name, pi_name_en);
  END
  $$

--
-- Create procedure `sp_create_admin_account`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_create_admin_account (pi_username nvarchar(100),
pi_passhash nvarchar(100))
BEGIN

  DECLARE count int UNSIGNED DEFAULT 0;


  IF IFNULL(pi_username, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'username cannot be empty';
  END IF;

  IF IFNULL(pi_passhash, '') = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'password cannot be empty';
  END IF;

  SELECT
    count(1) INTO count
  FROM t_admins
  WHERE a_username = LOWER(pi_username);

  IF count >= 1 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'already exists';
  END IF;

  INSERT INTO t_admins (a_username, a_password)
    VALUES (LOWER(pi_username), SHA2(pi_passhash, 256));
  SELECT
    MAX(a_id) AS a_id
  FROM t_admins;
END
$$

--
-- Create procedure `sp_child_delete_sub_cat`
--
CREATE
DEFINER = 'root'@'localhost'
PROCEDURE sp_child_delete_sub_cat (pi_id int)
sp:
  BEGIN
    DECLARE v_id int;

    IF IFNULL(pi_id, '') = '' THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id cannot be empty';
    END IF;

    #
    SELECT
      child_sub_cat_id INTO v_id
    FROM t_child_sub_category
    WHERE child_sub_cat_id = pi_id
    ;
    IF v_id IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'категори олдсонгүй!';
    END IF;
    DELETE
      FROM t_child_sub_category
    WHERE child_sub_cat_id = pi_id;
  END
  $$

DELIMITER ;

-- 
-- Restore previous SQL mode
-- 
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

-- 
-- Enable foreign keys
-- 
/*!40014 SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS */;
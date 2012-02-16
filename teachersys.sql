-- phpMyAdmin SQL Dump
-- version 3.3.2deb1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2011 年 04 月 01 日 18:50
-- 服务器版本: 5.1.41
-- PHP 版本: 5.3.2-1ubuntu4.7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `teachersys`
--

-- --------------------------------------------------------

--
-- 表的结构 `admin`
--

CREATE TABLE IF NOT EXISTS `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL COMMENT '用户名\n',
  `password` varchar(45) NOT NULL COMMENT '密码',
  PRIMARY KEY (`id`,`username`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='管理员表' AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`) VALUES
(1, 'neekey', 'a306598288');

-- --------------------------------------------------------

--
-- 表的结构 `paper`
--

CREATE TABLE IF NOT EXISTS `paper` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL COMMENT '论文名称\n',
  `brief` text COMMENT '论文简介',
  `date` int(10) unsigned NOT NULL COMMENT '论文发表时间',
  `teacher_id` int(11) NOT NULL COMMENT '作者id',
  PRIMARY KEY (`id`),
  KEY `fk_paper_1` (`teacher_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='论文' AUTO_INCREMENT=27 ;

--
-- 转存表中的数据 `paper`
--

INSERT INTO `paper` (`id`, `name`, `brief`, `date`, `teacher_id`) VALUES
(1, '论文1', '论文简介', 1041390847, 2),
(21, 'neekey', '', 599616000, 2),
(22, 'dddddd', '', 1041390847, 2),
(23, 'ddddddd', '', 1041390847, 2),
(24, 'gggggg', '', 1041390847, 2),
(25, 'vvvvv', 'vvvvvv', 23587200, 2),
(26, 'dddd', '', 1199145600, 1);

-- --------------------------------------------------------

--
-- 表的结构 `pic`
--

CREATE TABLE IF NOT EXISTS `pic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `path` varchar(200) NOT NULL COMMENT '图片存储路经',
  `type` varchar(20) NOT NULL COMMENT '图片的mime格式',
  `teacher_id` int(11) NOT NULL COMMENT '教师ID',
  `post_time` int(10) unsigned NOT NULL COMMENT '图片上传时间',
  `description` text COMMENT '图片描述\n',
  `croped` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_pic_1` (`teacher_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='用于存放图片' AUTO_INCREMENT=132 ;

--
-- 转存表中的数据 `pic`
--

INSERT INTO `pic` (`id`, `path`, `type`, `teacher_id`, `post_time`, `description`, `croped`) VALUES
(112, '/home/BUFFOLD/PHP/teachersys/upload/img/JYW.jpg', 'image/jpeg', 1, 1301641185, '0', 0),
(114, '/home/BUFFOLD/PHP/teachersys/upload/img/JYW.jpg', 'image/jpeg', 1, 1301641482, '0', 0),
(121, '/home/BUFFOLD/PHP/teachersys/upload/img/3c72059182bd28808d49c24c9697a796.jpg', 'image/jpeg', 1, 1301642280, '0', 1),
(124, '/home/BUFFOLD/PHP/teachersys/upload/img/96ce4a3f4784ff33fc39406607fc17d4.jpg', 'image/jpeg', 1, 1301651449, '0', 0),
(125, '/home/BUFFOLD/PHP/teachersys/upload/img/bbddc5a20cd7fbff123c3249ff601742.jpg', 'image/jpeg', 1, 1301651553, '0', 0),
(126, '/home/BUFFOLD/PHP/teachersys/upload/img/42c5efe72f28fa952d975accf7584368.jpg', 'image/jpeg', 1, 1301651568, '0', 0),
(127, '/home/BUFFOLD/PHP/teachersys/upload/img/8b8de6b254c16427a50c21b6cfd14ad1.jpg', 'image/jpeg', 1, 1301651582, '0', 0),
(128, '/home/BUFFOLD/PHP/teachersys/upload/img/34091c8e62bd6801786a9edf07eaa3d4.jpg', 'image/jpeg', 1, 1301651710, '0', 0),
(131, '/home/BUFFOLD/PHP/teachersys/upload/img/b0d619889ee9c0ee848142c8326a7a30.jpg', 'image/jpeg', 1, 1301652202, '0', 1);

-- --------------------------------------------------------

--
-- 表的结构 `project`
--

CREATE TABLE IF NOT EXISTS `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL COMMENT '科研项目名称',
  `brief` text COMMENT '科研项目简介',
  `date` int(10) unsigned NOT NULL COMMENT '科研项目时间',
  `teacher_id` int(11) NOT NULL COMMENT '科研项目教师名称\n',
  PRIMARY KEY (`id`),
  KEY `fk_project_1` (`teacher_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='科研项目' AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `project`
--

INSERT INTO `project` (`id`, `name`, `brief`, `date`, `teacher_id`) VALUES
(1, '项目1', '项目简介', 1041390847, 2);

-- --------------------------------------------------------

--
-- 表的结构 `sessions`
--

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(40) NOT NULL DEFAULT '0',
  `ip_address` varchar(16) NOT NULL DEFAULT '0',
  `user_agent` varchar(50) NOT NULL,
  `last_activity` int(10) unsigned NOT NULL DEFAULT '0',
  `user_data` text NOT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `sessions`
--

INSERT INTO `sessions` (`session_id`, `ip_address`, `user_agent`, `last_activity`, `user_data`) VALUES
('95e758b16bed38937d4e1c337db3585e', '0.0.0.0', 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.27 (', 1301652183, ''),
('f5f90ec9f42ee6840e5f9fb5bca86980', '0.0.0.0', 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.27 (', 1301652183, ''),
('a057719ff6dca4299a483e2846df3012', '0.0.0.0', 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.27 (', 1301652183, ''),
('c361aca9e2cdc415b01b376dd8ab9201', '0.0.0.0', 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.27 (', 1301654663, 'a:1:{s:4:"user";s:124:"a:2:{s:4:"type";s:5:"admin";s:4:"info";a:3:{s:2:"id";s:1:"1";s:8:"username";s:6:"neekey";s:8:"password";s:10:"a306598288";}}";}'),
('24b8f3641a5c74a1a570512f6faa2d08', '0.0.0.0', 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.27 (', 1301651389, ''),
('fd02656629a99b0e302cc8071557c96a', '0.0.0.0', 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.27 (', 1301651389, ''),
('a95b9745f3721f64801aa7544f7dd30a', '0.0.0.0', 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.27 (', 1301651389, '');

-- --------------------------------------------------------

--
-- 表的结构 `teacher`
--

CREATE TABLE IF NOT EXISTS `teacher` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(200) NOT NULL COMMENT '电子邮件',
  `password` varchar(45) NOT NULL DEFAULT '1111111111',
  `pic_id` int(11) DEFAULT NULL COMMENT '用于显示的照片，可以为教师相册中的一张 ',
  `name` varchar(45) NOT NULL DEFAULT '您的姓名' COMMENT '姓名',
  `sex` varchar(45) NOT NULL DEFAULT 'male' COMMENT '性别',
  `birthday` int(10) unsigned NOT NULL DEFAULT '1304219647' COMMENT '生日，以10位时间戳表示',
  `report_date` int(10) unsigned NOT NULL DEFAULT '1304219647' COMMENT '入职时间，以10位时间戳表示',
  `cellphone` varchar(20) DEFAULT NULL COMMENT '手机',
  `brief` text COMMENT '个人简介',
  `teac_rese_unit` int(11) DEFAULT NULL COMMENT '教研单位，外键，指向tru_place表',
  `title1` int(11) DEFAULT NULL COMMENT '职称1 必填， 如行政类高级教师，外键，指向title1表',
  `title1_type` int(11) DEFAULT NULL,
  `title1_level` int(11) DEFAULT NULL,
  `title2` int(11) DEFAULT NULL COMMENT '职称2： 可选，如博士生导师等； 外键，指向title2表',
  `activated` varchar(10) NOT NULL DEFAULT 'false' COMMENT '教师是否登录过',
  PRIMARY KEY (`id`,`email`),
  KEY `fk_teacher_1` (`teac_rese_unit`),
  KEY `fk_teacher_2` (`title1`),
  KEY `fk_teacher_3` (`title2`),
  KEY `fk_teacher_4` (`pic_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='教师信息\n' AUTO_INCREMENT=41 ;

--
-- 转存表中的数据 `teacher`
--

INSERT INTO `teacher` (`id`, `email`, `password`, `pic_id`, `name`, `sex`, `birthday`, `report_date`, `cellphone`, `brief`, `teac_rese_unit`, `title1`, `title1_type`, `title1_level`, `title2`, `activated`) VALUES
(1, 'ni184775761@gmail.com', 'neekey', 131, 'neekey', 'male', 1226546047, 1051154047, '15158133775', 'neekey 的个人简介的  ', 12, 1, 4, 5, 9, 'false'),
(2, 'neekey184775761@gmail.com', 'fff', 121, 'neekey', 'male', 1070248447, 1054437247, '15158133779', 'hahaaha', 2, 1, 0, 0, 6, 'false'),
(5, 'neekey@gmail.com', '1111111111', NULL, 'neekey', 'female', 1070162047, 1041390847, '15158233669', 'dddd', 3, 1, 0, 0, 1, 'false'),
(6, 'neekey184775761@gmail.com', '1111111111', NULL, '您的姓名', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(7, 'tt@gmail.com', '1111111111', NULL, 'neekey', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(8, 'haha@gmail.com', '1111111111', NULL, 'ddddd', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(9, 'hahaf@gmail.com', '1111111111', NULL, 'dddd', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(10, 'ddddd@gmail.com', '1111111111', NULL, 'ddddd', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(11, 'dddsada@gmail.com', '1111111111', NULL, 'ddddd', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(12, 'dddddddd@gmail.com', '1111111111', NULL, 'dddd', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(13, 'ffff@gmail.com', '1111111111', NULL, 'aaaa', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(14, 'kjhkh@gmail.com', '1111111111', NULL, 'nnnnnn', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(15, 'ddddddd@gmail.com', '1111111111', NULL, 'adgaga', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(16, 'ddddddddddddd@gmail.com', '1111111111', NULL, 'dddd', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(17, 'dringking@test.com', '1111111111', NULL, 'Dringking', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(18, 'neekeyhaha@gamil.com', '1111111111', NULL, 'aaaa', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(19, 'neekey@haha.com', '1111111111', NULL, 'dddddd', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(20, 'jkdhkdjhd@tttt.com', '1111111111', NULL, 'dddd', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(21, 'sfafasfad@gmail.com', '1111111111', NULL, 'dddddd', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(22, 'gaga@gmail.com', '1111111111', NULL, 'aaaaa', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(23, 'dddddasdad@gmail.com', '1111111111', NULL, 'ddddddd', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(24, 'jkljjk@kdfj.com', '1111111111', NULL, 'aaaa', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(25, 'ff@gkj.com', '1111111111', NULL, 'gagagddd', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(26, 'dgg@gmail.com', '1111111111', NULL, 'ddddddd', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(27, 'ddgdddag@gmail.com', '1111111111', NULL, 'dddd', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(28, 'stormage@gmail.com', '1111111111', NULL, '李翔', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(29, 'stormage@gmail.com', '1111111111', NULL, '李翔', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(30, 'scc@gmail.com', '1111111111', NULL, '沈成', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(31, 'dfsfs@gmail.com', '1111111111', NULL, 'dddsdfsfaddd', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(32, 'dddd@ggggg.com', '1111111111', NULL, 'dddddd', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(33, 'neekey@hhh.com', '1111111111', NULL, 'aaaa', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(34, 'neekesy@hhh.com', '1111111111', NULL, 'ssss', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(35, 'ds@gmail.com', '1111111111', NULL, 'aaaaa', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(36, 'dddddds@gmail.com', '1111111111', NULL, 'dddd', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(37, 'dfs@gmail.com', '1111111111', NULL, 'ddd', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(38, 'haajl@gmail.com', '1111111111', NULL, 'dddddddd', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(39, 'dddl@kdjd.com', '1111111111', NULL, 'agfa', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false'),
(40, 'daaaa@kljakl.com', '1111111111', NULL, 'aaaa', 'male', 1304219647, 1304219647, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'false');

-- --------------------------------------------------------

--
-- 表的结构 `teac_login`
--

CREATE TABLE IF NOT EXISTS `teac_login` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(200) NOT NULL,
  `password` varchar(45) NOT NULL DEFAULT '1111111111',
  PRIMARY KEY (`id`,`username`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='用于储存教师的登录信息的表' AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `teac_login`
--

INSERT INTO `teac_login` (`id`, `username`, `password`) VALUES
(1, 'ni184775761@gmail.com', '111'),
(2, 'neekey184775761@gmail.com', 'a306598288');

-- --------------------------------------------------------

--
-- 表的结构 `title1`
--

CREATE TABLE IF NOT EXISTS `title1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level_id` int(11) NOT NULL COMMENT '等级',
  `type_id` int(11) NOT NULL COMMENT '职称类别',
  PRIMARY KEY (`id`),
  KEY `fk_title_1` (`level_id`),
  KEY `fk_title_2` (`type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='职称1， 如思政类高级教师' AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `title1`
--

INSERT INTO `title1` (`id`, `level_id`, `type_id`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- 表的结构 `title1_level`
--

CREATE TABLE IF NOT EXISTS `title1_level` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL COMMENT '职称等级名称 如中级，高级等',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='职称1的级别' AUTO_INCREMENT=7 ;

--
-- 转存表中的数据 `title1_level`
--

INSERT INTO `title1_level` (`id`, `name`) VALUES
(1, '高级'),
(2, '初级'),
(3, '中级'),
(5, '超级教师'),
(6, '测试教师');

-- --------------------------------------------------------

--
-- 表的结构 `title1_type`
--

CREATE TABLE IF NOT EXISTS `title1_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL COMMENT '职称类别名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='职称1的类别表， 如思政，工程等' AUTO_INCREMENT=7 ;

--
-- 转存表中的数据 `title1_type`
--

INSERT INTO `title1_type` (`id`, `name`) VALUES
(1, '教科类s'),
(2, '人文类s'),
(3, '艺术类s'),
(4, 'ffffffffffdd'),
(5, 'nihao'),
(6, 'dagfa');

-- --------------------------------------------------------

--
-- 表的结构 `title2`
--

CREATE TABLE IF NOT EXISTS `title2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL COMMENT '职称名字\n',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='博士生导师，硕士生导师等职称' AUTO_INCREMENT=10 ;

--
-- 转存表中的数据 `title2`
--

INSERT INTO `title2` (`id`, `name`) VALUES
(1, '无'),
(2, '学士'),
(3, '博士'),
(4, '硕士ss'),
(6, '博士生导师'),
(8, '学士导师'),
(9, '测试职称2');

-- --------------------------------------------------------

--
-- 表的结构 `tru_place`
--

CREATE TABLE IF NOT EXISTS `tru_place` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_id` int(11) NOT NULL COMMENT '教研单位所属类别\n',
  `name` varchar(45) NOT NULL COMMENT '教研单位名称',
  PRIMARY KEY (`id`),
  KEY `fk_tru_place_1` (`type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='教研单位' AUTO_INCREMENT=16 ;

--
-- 转存表中的数据 `tru_place`
--

INSERT INTO `tru_place` (`id`, `type_id`, `name`) VALUES
(2, 1, '数字媒体技术研究所'),
(3, 2, '科研办公室'),
(10, 1, 'ddddddddddsaa'),
(11, 2, '行政办公室'),
(12, 2, '政法办公室'),
(13, 8, '计算机实验室'),
(14, 8, '人工智能实验室'),
(15, 1, 'new iem');

-- --------------------------------------------------------

--
-- 表的结构 `tru_type`
--

CREATE TABLE IF NOT EXISTS `tru_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL COMMENT '类别名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='教研单位类别表' AUTO_INCREMENT=11 ;

--
-- 转存表中的数据 `tru_type`
--

INSERT INTO `tru_type` (`id`, `name`) VALUES
(1, '研究所d的的淡定'),
(2, '办公室算'),
(8, '实验室的'),
(9, '测试项目'),
(10, 'ddddddd');

--
-- 限制导出的表
--

--
-- 限制表 `paper`
--
ALTER TABLE `paper`
  ADD CONSTRAINT `fk_paper_1` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `pic`
--
ALTER TABLE `pic`
  ADD CONSTRAINT `fk_pic_1` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `project`
--
ALTER TABLE `project`
  ADD CONSTRAINT `fk_project_1` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `teacher`
--
ALTER TABLE `teacher`
  ADD CONSTRAINT `fk_teacher_1` FOREIGN KEY (`teac_rese_unit`) REFERENCES `tru_place` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_teacher_2` FOREIGN KEY (`title1`) REFERENCES `title1` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_teacher_3` FOREIGN KEY (`title2`) REFERENCES `title2` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_teacher_4` FOREIGN KEY (`pic_id`) REFERENCES `pic` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `teac_login`
--
ALTER TABLE `teac_login`
  ADD CONSTRAINT `fk_teac_login_1` FOREIGN KEY (`id`, `username`) REFERENCES `teacher` (`id`, `email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `title1`
--
ALTER TABLE `title1`
  ADD CONSTRAINT `fk_title_1` FOREIGN KEY (`level_id`) REFERENCES `title1_level` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_title_2` FOREIGN KEY (`type_id`) REFERENCES `title1_type` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- 限制表 `tru_place`
--
ALTER TABLE `tru_place`
  ADD CONSTRAINT `fk_tru_place_1` FOREIGN KEY (`type_id`) REFERENCES `tru_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

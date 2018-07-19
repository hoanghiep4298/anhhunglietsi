database bussiness:
https://blog.hocexcel.online/cach-chuyen-doi-excel-sang-csv-va-xuat-cac-tep-excel-sang-dinh-dang-csv-utf-8.html

(đưa file .csv vào thư mục root (usr/tmp) macos)
COPY persons(first_name,last_name,dob,email) 
FROM '.../file.csv' DELIMITER ',' CSV HEADER;


set _my_datetime=%date%
set _my_datetime=%_my_datetime: =_%
set _my_datetime=%_my_datetime::=%
set _my_datetime=%_my_datetime:/=_%
set _my_datetime=%_my_datetime:.=_%

git add .
git commit -m %_my_datetime%
git push -u origin master
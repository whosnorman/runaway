kill -9 $(ps aux | grep 'mrt' | awk '{print $2}') & kill -9 $(ps aux | grep 'sass' | awk '{print $2}') & kill -9 $(ps aux | grep 'meteor' | awk '{print $2}')

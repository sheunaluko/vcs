# note - this makes some assumptions about directory structure on target machine 
# namely:  ~/dev/global_files/ exists 
# and: this script is run inside ../vcs/

dir=`pwd` 

export vcs_db_pass="Opensesame92!"
export vcs_db_user="oluwa"
export vcs_db_host="34.83.133.74"
alias ccn="mongo 34.83.133.74/vcs  -u oluwa -p Opensesame92! --authenticationDatabase admin"
export VCS_DEV_LOC="$dir/src/nodejs/vcs.js"
export VCS_DEV_DIR="$dir/src/nodejs/"
export NODE_UTILS_LOC="~/dev/global_files/node_utils.js" 

arr=(vcs_db_pass vcs_db_user vcs_db_host VCS_DEV_LOC VCS_DEV_DIR NODE_UTILS_LOC) 

for x in ${arr[*]}
do
    printf "Loaded environment var:\t[%s]\t-> [%s]\n" $x `printenv $x` 
done


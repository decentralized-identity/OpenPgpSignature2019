


# sign and verify detached
echo "hello world" > file.txt
cat ./file.txt | gpg --detach-sign --armor -u 3AF00854CF8D9237 > signed.gpg
gpg --verify --armor ./signed.gpg ./file.txt


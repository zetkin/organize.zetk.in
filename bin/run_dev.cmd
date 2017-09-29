start docker-volume-watcher -v organize_zetk_in

docker run ^
    -v %cd%/static:/var/app/static ^
    -v %cd%/bin:/var/app/bin ^
    -v %cd%/locale:/var/app/locale ^
    -v %cd%/src:/var/app/src ^
    --name organize_zetk_in ^
    --env ZETKIN_LOGIN_URL=http://login.dev.zetkin.org ^
    --env ZETKIN_APP_ID=a3 ^
    --env ZETKIN_APP_KEY=def456 ^
    --env ZETKIN_DOMAIN=dev.zetkin.org ^
    -p 80:80 ^
    -p 81:81 ^
    -t ^
    -i ^
    --rm ^
    organize_zetk_in

start docker-volume-watcher -v organize_zetk_in

docker run ^
    -v %cd%/static:/var/app/static ^
    -v %cd%/bin:/var/app/bin ^
    -v %cd%/locale:/var/app/locale ^
    -v %cd%/src:/var/app/src ^
    --name organize_zetk_in ^
    --env TOKEN_SECRET=012345678901234567891234 ^
    --env ZETKIN_LOGIN_URL=http://login.dev.zetkin.org ^
    --env ZETKIN_APP_ID=b420d6e07e3d41d096d0a964ab85e780 ^
    --env ZETKIN_APP_KEY=YWE3MzJlYWMtM2Q1Ny00NjQ4LWFjOTUtNDdjMTIxZmUxMDk5 ^
    --env ZETKIN_DOMAIN=dev.zetkin.org ^
    -p 80:80 ^
    -p 81:81 ^
    -t ^
    -i ^
    --rm ^
    organize_zetk_in

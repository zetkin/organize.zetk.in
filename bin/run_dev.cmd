docker run ^
    -v "%cd%/static:/var/app/static" ^
    -v "%cd%/bin:/var/app/bin" ^
    -v "%cd%/locale:/var/app/locale" ^
    -v "%cd%/src:/var/app/src" ^
    --name organize_zetk_in ^
    --env TOKEN_SECRET=012345678901234567891234 ^
    --env ZETKIN_LOGIN_URL=http://login.dev.zetkin.org ^
    --env ZETKIN_APP_ID=2dab3ce079234744aeb4b6cc38abdd00 ^
    --env ZETKIN_APP_KEY=OGJlNTQyOTktMzBjNy00MzllLWIwNDgtM2RjYTA3MjZlZTIz ^
    --env ZETKIN_DOMAIN=dev.zetkin.org ^
    --env ZETKIN_USE_TLS=0 ^
    -p 80:80 ^
    -p 81:81 ^
    -t ^
    -i ^
    --rm ^
    organize_zetk_in

import React, {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useNavigate , Link} from "react-router-dom";
import axios from "axios";
import {removeCookieToken, setRefreshToken} from "src/member/storage/Cookie";

const theme = createTheme();


const LoginForm = () => {


    const initKakao = () => {
        const jsKey = "8645acd0e5c87d5d3a9ec02a6ab65543";
        const Kakao = window.Kakao;
        if (Kakao && !Kakao.isInitialized()) {
            Kakao.init(jsKey);
            console.log(Kakao.isInitialized());
        }
    };

    useEffect(() => {
        initKakao();
    }, []);


    const kakaoLogin = () => {
        window.Kakao.Auth.login({
            success() {
                window.Kakao.API.request({
                    url: "/v2/user/me",
                    success(res) {
                        const kakaoAccount = res.kakao_account;
                        const aaa = {
                            name: kakaoAccount.profile.nickname,
                            birth: '05'+kakaoAccount.birthday,
                            phoneNumber: '',
                            username:  kakaoAccount.email,
                            password: '1q2w3e4r',
                            email: kakaoAccount.email
                        }

                        axios.get(`http://localhost:3000/member/existName2?username=${kakaoAccount.email}`)
                            .then(res => {
                                if (res.data === 'exist') {
                                    axios.post(`http://localhost:3000/auth/login`,{
                                        username: aaa.username,
                                        password: aaa.password
                                    }).then(res => {
                                        if (res.data) {
                                            setRefreshToken(res.data.refreshToken); // ????????? ?????????????????? ??????
                                            localStorage.setItem("accessToken", res.data.accessToken); // ????????????????????? ????????? ?????? ??????
                                            localStorage.setItem("expireTime", res.data.tokenExpiresIn); // ??????????????? ???????????? ??????

                                            const accessTokenVal = localStorage.getItem("accessToken");

                                            axios.get("/member/me", {
                                                headers: {
                                                    Authorization: `Bearer ${accessTokenVal}`
                                                }
                                            }).then(res => {
                                                sessionStorage.setItem("userName", res.data.username);
                                                sessionStorage.setItem("birth", res.data.birth);
                                                console.log(res.data.name)
                                                history.back();
                                            }).catch(error => {
                                                console.log("(?????? ????????????(10???)?????? ?????? ????????????)?????? ??????????????? ????????????! " + error.response);
                                                localStorage.removeItem('accessToken');
                                                localStorage.removeItem('expireTime');
                                                removeCookieToken();
                                            })
                                        }
                                    }).catch(error => {
                                        console.log(error.response);
                                    })

                                } else {

                                    axios.post('http://localhost:3000/auth/signup', null, {params: aaa})
                                        .then(() => {

                                            axios.post(`http://localhost:3000/auth/login`,{
                                                username: aaa.username,
                                                password: aaa.password
                                            }).then(res => {
                                                if (res.data) {
                                                    setRefreshToken(res.data.refreshToken); // ????????? ?????????????????? ??????
                                                    localStorage.setItem("accessToken", res.data.accessToken); // ????????????????????? ????????? ?????? ??????
                                                    localStorage.setItem("expireTime", res.data.tokenExpiresIn); // ??????????????? ???????????? ??????

                                                    const accessTokenVal = localStorage.getItem("accessToken");

                                                    axios.get("/member/me", {
                                                        headers: {
                                                            Authorization: `Bearer ${accessTokenVal}`
                                                        }
                                                    }).then(res => {
                                                        sessionStorage.setItem("userName", res.data.username);
                                                        sessionStorage.setItem("birth", res.data.birth);
                                                        console.log(res.data.name)
                                                        history.back();
                                                    }).catch(error => {
                                                        console.log("(?????? ????????????(10???)?????? ?????? ????????????)?????? ??????????????? ????????????! " + error.response);
                                                        localStorage.removeItem('accessToken');
                                                        localStorage.removeItem('expireTime');
                                                        removeCookieToken();
                                                    })
                                                }
                                            }).catch(error => {
                                                console.log(error.response);
                                            })
                                        })
                                        .catch(error => console.log(error));

                                }
                            })
                            .catch(error => console.log(error));


                    },
                    fail(error) {
                        console.log(error);
                    },
                });
            },
            fail(error) {
                console.log(error);
            },
        });
    };

    const [form, setForm] = useState({
        username: '',
        password: ''
    })

    const inputValue = (e) => {

        const {name, value} = e.target
        setForm({
            ...form,
            [name]: value
        });

    }

    const {username, password} = form;

    const navi = useNavigate();


    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`http://localhost:3000/auth/login`,{
            username: form.username,
            password: form.password
        }).then(res => {
            if (res.data) {
                setRefreshToken(res.data.refreshToken); // ????????? ?????????????????? ??????
                localStorage.setItem("accessToken", res.data.accessToken); // ????????????????????? ????????? ?????? ??????
                localStorage.setItem("expireTime", res.data.tokenExpiresIn); // ??????????????? ???????????? ??????

                const accessTokenVal = localStorage.getItem("accessToken");

                axios.get("/member/me", {
                    headers: {
                        Authorization: `Bearer ${accessTokenVal}`
                    }
                }).then(res => {
                    sessionStorage.setItem("userName", res.data.username);
                    sessionStorage.setItem("birth", res.data.birth);
                    console.log(res.data.name)
                    history.back();
                }).catch(error => {
                    console.log("(?????? ????????????(10???)?????? ?????? ????????????)?????? ??????????????? ????????????! " + error.response);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('expireTime');
                    removeCookieToken();
                })
            }
        }).catch(error => {
            console.log(error.response);
            alert("????????? ?????? ??????????????? ???????????????");
        })

    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img src="../img_member/mainLogo.png" alt="logo" width="50%" style={{cursor:"pointer"}} onClick={()=>{navi("/")}}/>
                    <Avatar sx={{m: 1, backgroundColor: "#B20710"}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        ?????????
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            autoFocus={true}
                            id="username"
                            label="?????????"
                            name="username"
                            value={username}
                            onChange={inputValue}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            required
                            name="password"
                            label="????????????"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={inputValue}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 1}}
                        >
                            ?????????
                        </Button>
                        <Button
                            style={{backgroundColor: "#F9E000", color:"#3A1D1D", marginTop:"5px"}}
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 1}}
                            onClick={kakaoLogin}
                        ><img src="../img_member/kakaoIcon.png" alt={"kakaoIcon"} style={{width:"24px"}}/>
                            ??????????????????
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to={'/member/FindIdPasswordRoutes'} variant="body2">
                                    ????????? ?????? ???????????? ??????
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to={'/member/joinForm'} variant="body2">
                                    ????????????
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default LoginForm;
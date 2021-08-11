import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { keys } from "@material-ui/core/styles/createBreakpoints";

const useStyles = makeStyles((theme) => ({
    "@global": {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: "none",
        },
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbar: {
        flexWrap: "wrap",
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    cardHeader: {
        backgroundColor: theme.palette.type === "light" ? theme.palette.grey[200] : theme.palette.grey[700],
    },
    cardPricing: {
        display: "flex",
        justifyContent: "center",
        alignItems: "baseline",
        marginBottom: theme.spacing(2),
    },
    footer: {
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(8),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        [theme.breakpoints.up("sm")]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6),
        },
    },
}));

const tiers = [
    {
        title: "정답/해설",
        description: "정답 및 해설 보러가기",
        buttonText: "정답/해설 다운로드",
        docLink: "doc/beginner.pdf",
        buttonVariant: "outlined",
        
    }
]

export default function Result(props) {
    const classes = useStyles();
    let result = props.result;
    let quizCheck = props.quizCheck;
    let total_count = Object.keys(result).length;//총 문제갯수

    const test = () => {//총 문제를 반환하는
        return (
            <div>
                {Object.keys(result).map((obj, i) => <div key={i}>{result[obj]}</div>)}
            </div>
        )
    }
    
    const test2 = () => {//맞춘 문제의 values값만
        return (
            <div>
                {Object.values(quizCheck).map((obj, i) => <div values={i}>{quizCheck[obj]}</div>)}
                {/* <div >제가 좋아하는 숫자는 {props.quizCheck}</div> */}
            </div>
        )
    }
 
    const arr = quizCheck;
    var right_answer = [];

    Object.values(quizCheck).forEach(element => {
        if(element == 1) {
            right_answer.push(element);
        }
    });
        console.log("right_answer : ",right_answer);
    

    return (
    //    <React.Fragment>
    //       맞힌 문제 수 : &nbsp;
    //       {/* {test()} */}
    //       {right_answer.length}
    //       <br></br>
    //       총 문제 수 : &nbsp;
    //       {/* {test2()} */}
    //       {total_count}
    //    </React.Fragment>
       
        <React.Fragment>
            <CssBaseline />
            <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                        모의고사
                    </Typography>
                    <Button
                        onClick={() => {
                            document.location.reload();
                        }}
                        color="primary"
                        variant="outlined"
                        className={classes.link}
                    >
                        다시 하기
                    </Button>
                    <Button
                        onClick={() => {
                            window.close();
                        }}
                        color="primary"
                        variant="contained"
                        className={classes.link}
                    >
                        닫기
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="sm" component="main" className={classes.heroContent}>
                <Typography component="h2" variant="h2" align="center" color="textPrimary" gutterBottom>
                    모의고사 채점 결과
                </Typography>
                <br></br>
                <Typography variant="h4" align="center" color="textSecondary" component="p" gutterBottom>
                    맞은 문제 수 / 총 문제 수 <br></br>
                    <br></br>
                    {right_answer.length} /  {total_count}
                </Typography>
                <Typography variant="h5" align="center" color="textSecondary" component="p">
                   ---점수가 들어갈 공간---(추가여부 확인)
                </Typography>
            </Container>

            <Container maxWidth="md" component="main">
                <Grid container spacing={5} alignItems="flex-end">
                    {tiers.map((tier) => (//justify-content: center;로 정렬
                        // Enterprise card is full width at sm breakpoint
                        <Grid item key={tier.title} xs={12} sm={tier.title === "Enterprise" ? 12 : 6} md={4}>
                            <Card>
                                <CardHeader
                                    title={tier.title}
                                    subheader={tier.subheader}
                                    titleTypographyProps={{ align: "center" }}
                                    subheaderTypographyProps={{ align: "center" }}
                                    //action={tier.title === 'Pro' ? <StarIcon /> : null}
                                    className={classes.cardHeader}
                                />
                                <CardContent>
                                    <div className={classes.cardPricing}>
                                        <Typography component="p" variant="h5" color="textPrimary" >
                                            {tier.description}
                                        </Typography>
                                    </div>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        href={tier.docLink}
                                        target="_blank"
                                        fullWidth
                                        variant={tier.buttonVariant}
                                        color="primary"
                                    >
                                        {tier.buttonText}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </React.Fragment>
        
    );
}


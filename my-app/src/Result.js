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
        title: "초급자",
        description: "평균 3점 미만",
        buttonText: "보충자료 다운로드",
        docLink: "doc/beginner.pdf",
        buttonVariant: "outlined",
    },
    {
        title: "중급자",
        description: "평균 3 ~ 4점",
        buttonText: "보충자료 다운로드",
        docLink: "doc/intermediate.pdf",
        buttonVariant: "outlined",
    },
    {
        title: "고급자",
        description: "평균 4점 초과",
        buttonText: "보충자료 다운로드",
        docLink: "doc/advanced.pdf",
        buttonVariant: "outlined",
    },
];

export default function Result(props) {
    const classes = useStyles();
    let level = "초급";
    if (props.result > 4) {
        tiers[2].buttonVariant = "contained";
        level = "고급";
    } else if (props.result >= 3) {
        tiers[1].buttonVariant = "contained";
        level = "중급";
    } else if (props.result < 3) {
        tiers[0].buttonVariant = "contained";
        level = "초급";
    }
// export default function Result(props) {
//     const classes = useStyles();
//     let level = "초급";
//     if (props.result > 4) 
       
    return (
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
            {/* Hero unit */}
            <Container maxWidth="sm" component="main" className={classes.heroContent}>
                <Typography component="h2" variant="h2" align="center" color="textPrimary" gutterBottom>
                    모의고사 결과
                </Typography>
                <Typography variant="h4" align="center" color="textSecondary" component="p" gutterBottom>
                    당신의 역량은 {level} 입니다.
                    {/* 당신의 점수는 "" 입니다. */}
                </Typography>
                <Typography variant="h5" align="center" color="textSecondary" component="p">
                    <a href="">정답/해설 보러가기</a>
                </Typography>
            </Container>
            {/* End hero unit */}
            <Container maxWidth="md" component="main">
                <Grid container spacing={5} alignItems="flex-end">
                    {tiers.map((tier) => (
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
                                        <Typography component="p" variant="h5" color="textPrimary">
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

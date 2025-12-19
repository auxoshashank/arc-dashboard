import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import JsonList from './JsonList';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

export default function RecipeReviewCard({txt, heading, myheight}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card>    
      <CardActions disableSpacing>  
        <h3 class="borderBottom" style={{marginLeft:15}}> 
            {heading.split('_').map(each => each.charAt(0).toUpperCase() + each.slice(1)).join(' ')}
        </h3>     
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      {!expanded ? (
      <CardContent>
        {myheight ?
         (<div style={{"height":"800px","overflow":"hidden","width":"90%","marginLeft":15}}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {
              (typeof txt == 'object') ? <JsonList data={txt} /> : <div style={{"paddingLeft":20}}>{txt}</div>
            }  
            </Typography>
        </div>) : 
        (<div style={{"height":"400px","overflow":"hidden","width":"90%","marginLeft":15}}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {
              (typeof txt == 'object') ? <JsonList data={txt} /> : <div style={{"paddingLeft":20}}>{txt}</div>
            }            
            </Typography>
        </div>)}
      </CardContent>) : ""}
   
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <div style={{"height":"100%","overflow":"hidden","width":"90%","marginLeft":15}}>
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            {
              (typeof txt == 'object') ? <JsonList data={txt} /> : <div style={{"paddingLeft":20}}>{txt}</div>
            }
          </Typography></div>
        </CardContent>
      </Collapse>
    </Card>
  );
}
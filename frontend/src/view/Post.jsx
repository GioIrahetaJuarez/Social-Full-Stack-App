import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {red} from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';

import {useState} from 'react';
import PropTypes from 'prop-types';


/**
 * Post Item
 * @param {string} props props fulll of data
 * @returns {object} JSX for post
 */
function Post(props) {
  const [likeCount, setLikeCount] = useState(0);
  const addLike = async () => {
    await fetch(
        `http://localhost:3010/api/v0/post/${props.data.id}/like`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        },
    );

    setLikeCount(1);
  };
  return (
    <Card sx={{maxWidth: 345}}>
      <CardHeader avatar={
        <Avatar sx={{bgcolor: red[500]}}>
            U
        </Avatar>
      }
      title={`Post by ${props.data.author}`}
      subheader={formatDate(props.data.created)}
      />
      <CardMedia component="img"
        height="194"
        image={props.data.img}
      />
      <CardContent>
        <Typography variant="body2" sx={{color: 'text.secondary'}}>
          {props.data.text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="like" onClick={addLike}>
          <FavoriteIcon/>
        </IconButton>
        <Typography variant="body2" sx={{color: 'text.secondary'}}>
          {likeCount}
        </Typography>
      </CardActions>
    </Card>
  );
}

Post.propTypes = {
  data: PropTypes.object,
};

export default Post;
// Helper functions ===================================================
/**
 * @param {string} date old date
 * @returns {string} new date Helped by claude
 */
function formatDate(date) {
  const received = new Date(date);
  const rn = new Date();
  const today = new Date(rn.getFullYear(), rn.getMonth(), rn.getDate());
  const past = new Date(today);
  past.setDate(past.getDate() - 1);

  const mail = new Date(received.getFullYear(),
      received.getMonth(), received.getDate());

  if (mail.getTime() === today.getTime()) {
    return received.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } else if (mail.getTime() === past.getTime()) {
    return 'Yesterday';
  } else {
    const lastyear = new Date(rn);
    lastyear.setMonth(lastyear.getMonth() - 12);
    if (mail > lastyear) {
      return mail.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
      });
    }
    return mail.getFullYear().toString();
  }
}

import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { CardSubtitle } from 'reactstrap';
import {
  Comment,
  Debate,
  GlobalState,
  PublicRequestKeys,
  User,
} from 'platonist-library';
// import TimeAgo from 'react-timeago';
import { useSelector } from 'react-redux';
import { DismissButton } from './DismissButton';
import { CommentForm } from './CommentForm';

export interface CommentItemProps {
  debateId: Debate['id'];
  editQuery: string;
  handleSuccess: () => void;
  item: Comment;
  user?: User;
}

export const CommentItem: FunctionComponent<CommentItemProps> = ({
  debateId,
  editQuery,
  handleSuccess,
  item,
  user,
}) => {
  const author = item.user as User;

  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state[PublicRequestKeys.Router]);

  const createdAt = new Date(item.created_at).toUTCString();
  const updatedAt = new Date(item.updated_at).toUTCString();

  return (
    <>
      <CardSubtitle>
        <small>
          {author && (
            <Link to={`/user/${user?.id === author?.id ? 'me' : author.id}`}>
              {user?.id === author?.id ? 'You' : <>{author.username}</>}
            </Link>
          )}{' '}
          <span>
            commented{' '}
            <i>
              {/* <TimeAgo date={item.created_at} /> */}
            </i>{' '}
            {createdAt !== updatedAt && (
              <>
                and edited this debate{' '}
                <i>
                  {/* <TimeAgo date={item.updated_at} /> */}
                </i>
                .
              </>
            )}{' '}
          </span>
        </small>
      </CardSubtitle>
      <div className={'card-text'}>
        {location.search !== editQuery ? (
          <p>{item.comment}</p>
        ) : (
          <>
            <DismissButton
              isBtn={false}
              pathname={location.pathname}
              title="Cancel"
            />
            <CommentForm
              commentId={item.id}
              debateId={debateId}
              defaultData={{ comment: item.comment }}
              dismissElement={
                <DismissButton
                  className="btn-sm mr-3"
                  isBtn={true}
                  pathname={location.pathname}
                  title="Cancel"
                />
              }
              onSuccess={handleSuccess}
              reset={false}
            />
          </>
        )}
      </div>
    </>
  );
};

import { Link } from "react-router-dom";

import "./UserItem.css";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";

const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/tickets`}>
          <div className="user-item__image">
            <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              Admin
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};
export default UserItem;

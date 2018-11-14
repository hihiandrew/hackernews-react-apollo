import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import Link from './Link';

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

class Search extends Component {
  state = {
    links: [],
    filter: '',
  };

  _executeSearch = async () => {
    const { filter } = this.state;
    const { client } = this.props;
    const result = await client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter },
    });
    const links = result.data.feed.links;
    this.setState({ links });
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });
  _updateCacheAfterVote = (store, createVote, linkId) => {
    const data = store.readQuery({ query: FEED_SEARCH_QUERY });
    const votedLink = data.feed.links.find(link => link.id === linkId);
    votedLink.votes = createVote.link.votes;
    store.writeQuery({ query: FEED_SEARCH_QUERY, data });
  };

  render() {
    return (
      <div>
        <div>
          Search
          <input type="text" name="filter" onChange={this.handleChange} />
          <button onClick={() => this._executeSearch()}>OK</button>
        </div>
        {this.state.links.map((link, index) => (
          <Link
            key={link.id}
            link={link}
            index={index}
            updateStoreAfterVote={this._updateCacheAfterVote}
          />
        ))}
      </div>
    );
  }
}

export default withApollo(Search);

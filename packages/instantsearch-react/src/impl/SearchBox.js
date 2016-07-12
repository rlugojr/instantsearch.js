import React, {Component, PropTypes} from 'react';
import themeable from 'react-themeable';

import createSearchBox from '../createSearchBox';

import {getTranslation} from './utils';

const defaultTranslations = {
  submit: null,
  reset: null,
  submitTitle: 'Submit your search query.',
  resetTitle: 'Clear the search query.',
  placeholder: 'Search your website',
};

class SearchBox extends Component {
  static propTypes = {
    // Provided by `createSearchBox`
    query: PropTypes.string,
    setQuery: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,

    theme: PropTypes.object,
    translations: PropTypes.object,
    placeholder: PropTypes.string,
    poweredBy: PropTypes.bool,
    autoFocus: PropTypes.bool,
    searchAsYouType: PropTypes.bool,
    queryHook: PropTypes.func,
  };

  static defaultProps = {
    query: '',

    theme: {
      root: 'SearchBox',
      wrapper: 'SearchBox__wrapper',
      input: 'SearchBox__input',
      submit: 'SearchBox__submit',
      reset: 'SearchBox__reset',
    },
    translations: defaultTranslations,
    poweredBy: false,
    autoFocus: false,
    searchAsYouType: true,
    queryHook: (query, search) => search(query),
  };

  constructor(props) {
    super();

    this.state = {
      query: props.query,
    };
  }

  onInputMount = input => {
    this.input = input;
  };

  onSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    const {queryHook, searchAsYouType} = this.props;
    const {query} = this.state;
    if (!searchAsYouType) {
      queryHook(query, this.search);
    }
    return false;
  };

  onChange = e => {
    const {queryHook, searchAsYouType} = this.props;
    const query = e.target.value;
    this.setState({query});
    if (searchAsYouType) {
      queryHook(query, this.search);
    }
  };

  onReset = () => {
    const {queryHook, searchAsYouType} = this.props;
    this.setState({
      query: '',
    }, () => {
      this.input.focus();
    });
    if (searchAsYouType) {
      queryHook('', this.search);
    }
  };

  search = query => {
    const {setQuery, search} = this.props;
    setQuery(query);
    search();
  };

  render() {
    const {
      theme,
      translations,
      autoFocus,
    } = this.props;
    const {query} = this.state;
    const th = themeable(theme);

    return (
      <form
        noValidate
        onSubmit={this.onSubmit}
        onReset={this.onReset}
        {...th('root', 'root')}
      >
        <div
          role="search"
          {...th('wrapper', 'wrapper')}
        >
          <input
            ref={this.onInputMount}
            type="search"
            placeholder={getTranslation(
              'placeholder',
              defaultTranslations,
              translations
            )}
            autoFocus={autoFocus}
            autoComplete={false}
            required
            value={query}
            onChange={this.onChange}
            {...th('input', 'input')}
          />
          <button
            type="submit"
            title={getTranslation(
              'submitTitle',
              defaultTranslations,
              translations
            )}
            {...th('submit', 'submit')}
          >
            {getTranslation('submit', defaultTranslations, translations)}
          </button>
          <button
            type="reset"
            title={getTranslation(
              'resetTitle',
              defaultTranslations,
              translations
            )}
            {...th('reset', 'reset')}
          >
            {getTranslation('reset', defaultTranslations, translations)}
          </button>
        </div>
      </form>
    );
  }
}

export default createSearchBox(SearchBox);
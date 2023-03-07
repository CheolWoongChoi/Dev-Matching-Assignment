import { fetchLanguages } from "./api.js";
import Suggestion from "./components/Suggestion.js";
import SearchInput from "./components/SearchInput.js";
import SelectedLanguages from "./components/SelectedLanguages.js";

export default function App({ $target }) {
  const prevState = JSON.parse(localStorage.getItem("state"));

  this.state = prevState || {
    fetchedLanguages: [],
    selectedLanguages: [],
    keyword: "",
  };

  this.setState = (nextState) => {
    this.state = {
      ...this.state,
      ...nextState,
    };

    suggestion.setState({
      selectedIndex: 0,
      items: this.state.fetchedLanguages,
      keyword: this.state.keyword,
    });
    selectedLanguages.setState(this.state.selectedLanguages);

    localStorage.setItem("state", JSON.stringify(this.state));
  };

  const selectedLanguages = new SelectedLanguages({
    $target,
    initialState: this.state.selectedLanguages,
  });

  const searchInput = new SearchInput({
    $target,
    initialState: this.state.keyword,
    onChange: async (keyword) => {
      if (keyword.length === 0) {
        this.setState({
          fetchedLanguages: [],
          keyword,
        });
      } else {
        const languages = await fetchLanguages(keyword);

        this.setState({
          fetchedLanguages: languages,
          keyword,
        });
      }
    },
  });

  const suggestion = new Suggestion({
    $target,
    initialState: {
      selectedIndex: 0,
      items: this.state.fetchedLanguages,
      keyword: this.state.keyword,
    },
    onSelect: (language) => {
      alert(language);

      const nextSelectedLanguages = [...this.state.selectedLanguages];
      const index = nextSelectedLanguages.findIndex(
        (selectedLanguage) => selectedLanguage === language
      );

      if (index > -1) {
        nextSelectedLanguages.splice(index, 1);
      }

      nextSelectedLanguages.push(language);

      this.setState({
        ...this.setState,
        selectedLanguages: nextSelectedLanguages,
      });
    },
  });
}

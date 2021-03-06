import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import classes from './Minifigs.css';

import Pagination from "react-js-pagination";
import Minifig from './Minifig/Minifig';
import CircularProgress from '@material-ui/core/CircularProgress';
import MinifigsMenu from '../MinifigsMenu/MinifigsMenu';

class Minifigs extends Component {
    state = {
        minifigsList : null, // List of minifigs in the active page
        totalItemsCount: null // The items count with our parameters ("missing", "owned", "all", tag or characterName)
    }
    componentDidMount () {
        // When we have tags and characNames we check the search
        if (this.props.tags && this.props.characNames) {
            this.manageSearch(this.props.history.location.search);
        }

        // If the minifig list is null and we have the minifigs and number per page we set it
        if(this.state.minifigsList === null && this.props.minifigs && this.props.numberPerPage) {
            this.setMinifigsList(this.state);
        }
    }

    componentDidUpdate (prevProps, prevState) {
        // If we have a change of props we se the minifig list
        if((this.props.minifigs && this.props.numberPerPage) &&
        (this.props !== prevProps)){
			this.setMinifigsList(prevState);
        }
        if (this.props.tags && this.props.characNames) {
            this.manageSearch(this.props.history.location.search);
        }
    }

    manageSearch (search) {
        // If there is no search and the tag and characName are not already null we set them to null
        if (!search) {
            if(this.props.tagSelected !== null){this.props.setTag(null)}
            if(this.props.characSelected !== null){this.props.setCharac(null)}
        }
        const param = search.split("=")[0].replace("?", "");
        const value = decodeURIComponent(search.split("=")[1]) ;

        //If we have a tag that is not already selected we set it
        if (param === "tag" && value !== this.props.tagSelected) {
            // If the tag exist we set it, else we redirect to "/"
            if (this.props.tags.map(tag => tag.name).indexOf(value) !== -1) {
                this.props.setTag(value);
            } else {this.props.history.push('/')}
        }
        //If we have a characName that is not already selected we set it
        if (param === "characterName" && value !== this.props.characSelected) {
            // If the character name exist we set it, else we redirect to "/"
            if (this.props.characNames.map(charac => charac.name).indexOf(value) !== -1) {
                this.props.setCharac(value);
            } else {this.props.history.push('/')}
        }
    }

    setMinifigsList (state) {
        // The begin and the end of the active page
        const begin = ((this.props.activePage-1) * this.props.numberPerPage);
        const end = begin + this.props.numberPerPage;

        // The list of minifigs we are showing
        let minifigListObject = {};
        Object.keys(this.props.minifigs).forEach(minifig => {
            const possession = this.props.minifigs[minifig].possessed;
            // First we check the possession
            if ((this.props.show === "all")
                || (this.props.show === "owned" && possession)
                || (this.props.show === "missing" && !possession)){
                    // Then we check if we have a tag selected
                    if (this.props.tagSelected){
                        const tags = this.props.minifigs[minifig].tags;
                        for (const i in tags){
                            if (tags[i] === this.props.tagSelected ){
                                minifigListObject[minifig] = minifig;
                            }
                        }
                    // And if we have a character name selected
                    } else if(this.props.characSelected) {
                        const name = this.props.minifigs[minifig].characterName;
                        if (name === this.props.characSelected ){
                            minifigListObject[minifig] = minifig;
                        }
                    } else {minifigListObject[minifig] = minifig;}

            }
        })
        // The number of minifigs we are showing for the pagination
        const totalItemsCount = Object.keys(minifigListObject).length;
        if(state.totalItemsCount !== totalItemsCount) {
            this.setState({totalItemsCount: totalItemsCount})
        }

        // We manage the active page if it does change
        const numberOfPage = Math.ceil(totalItemsCount/this.props.numberPerPage);
        if ( numberOfPage < this.props.activePage && numberOfPage > 0) {
            this.props.setActivePage(numberOfPage);
        }
        // The minifigs that we are showing on our active page
        const minifigsList = Object.keys(minifigListObject).slice(begin, end);
        if ((this.state.minifigsList === null) || (minifigsList !== state.minifigsList)){
            this.setState({minifigsList : minifigsList});
        }
    }

	handlePageChange = (pageNumber) => {
		this.props.setActivePage(pageNumber);
	}

	render () {
		// While the minifigs aren't loaded we show a spinner, if we have an error we show a message
		let minifigs = this.props.error ? <p>Minifigs can't be loaded!</p> : <CircularProgress className={classes.Spinner} size={200} thickness={1.5} />;
		let pagination = null;

        if (this.state.minifigsList) {
            // We map our list to show each minifig on the page
			minifigs = this.state.minifigsList.map(minifig => {
				const minifigDetail = {...this.props.minifigs[minifig]};
				return (
					<Minifig
						key={minifig}
						reference={minifig}
                        minifigDetail={minifigDetail}
					/>
				)
			})

			// react-js-pagination package used, you can check the info on github
			pagination = <Pagination
			    firstPageText='first'
    			lastPageText='last'
				hideDisabled
				linkClassPrev={classes.DisplayNone}
				linkClassNext={classes.DisplayNone}
		    	activePage={this.props.activePage}
		    	itemsCountPerPage={this.props.numberPerPage}
		    	totalItemsCount={this.state.totalItemsCount}
		    	onChange={this.handlePageChange}
		    	innerClass={classes.PaginationUl}
		    	activeClass={classes.Active}
			/>
        }

		// We render the minifigs with Pagination top and bottom
		return (
			<div className={classes.Minifig}>
                <MinifigsMenu />
				<div className={classes.Pagination}>
					{pagination}
				</div>
				<div className={classes.MinifigsList}>
					{minifigs}
				</div>
				<div className={classes.Pagination}>
					{pagination}
				</div>
			</div>
		);
	}
}

// We get redux state and action
const mapStateToProps = state => ({
    minifigs: state.minifigs.minifigs,
    numberPerPage: state.minifigs.numberPerPage,
    activePage: state.minifigs.activePage,
    error: state.minifigs.error,
    show: state.minifigs.show,
    totalNumber: state.minifigs.totalNumber,
    numberOwned: state.minifigs.numberOwned,
    tags: state.minifigs.tags,
    tagSelected: state.minifigs.tagSelected,
    characNames: state.minifigs.characNames,
    characSelected: state.minifigs.characSelected
})

const mapDispatchToProps = dispatch => ({
    setActivePage: (activePage) => dispatch(actions.setActivePage(activePage)),
    setTag: (tag) => dispatch(actions.setTag(tag)),
    setCharac: (characSelected) => dispatch(actions.setCharac(characSelected))
})

export default connect(mapStateToProps, mapDispatchToProps)(Minifigs);



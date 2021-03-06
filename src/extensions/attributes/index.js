/**
 * External Dependencies
 */
import classnames from 'classnames';

/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { Fragment }	= wp.element;
const { compose, createHigherOrderComponent } = wp.compose;

const allowedBlocks = [ 'coblocks/row', 'coblocks/column', 'coblocks/features', 'coblocks/feature', , 'coblocks/media-card', 'coblocks/shape-divider' ];

/**
 * Filters registered block settings, extending attributes with settings
 *
 * @param {Object} settings Original block settings.
 * @return {Object} Filtered block settings.
 */
function addAttributes( settings ) {

	// Add custom selector/id
	if( allowedBlocks.includes( settings.name ) && typeof settings.attributes !== 'undefined' ) {
		settings.attributes = Object.assign( settings.attributes, {
			coblocks: { type: 'object' }
		} );
	}

	return settings;
}

/**
 * Add custom CoBlocks attributes to selected blocks
 *
 * @param {function|Component} BlockEdit Original component.
 * @return {string} Wrapped component.
 */
const withAttributes = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {

		const {
			clientId,
			attributes,
			setAttributes,
		} = props;

		if ( typeof attributes.coblocks === 'undefined' ) {
			attributes.coblocks = [];
		}

		//add unique selector
		if( allowedBlocks.includes( props.name ) && typeof attributes.coblocks.id === 'undefined' ){
			let d = new Date();

			if( typeof attributes.coblocks !== 'undefined' && typeof attributes.coblocks.id !== 'undefined' ){
				delete attributes.coblocks.id;
			}

			const coblocks = Object.assign( { id: "" + d.getMonth() + d.getDate() + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds() }, attributes.coblocks );
			setAttributes( { coblocks: coblocks } );
		}

		return (
			<Fragment>
				<BlockEdit {...props} />
			</Fragment>
		);
	};
}, 'withAttributes');

addFilter(
	'blocks.registerBlockType',
	'coblocks/custom/attributes',
	addAttributes
);

addFilter(
	'editor.BlockEdit',
	'coblocks/attributes',
	withAttributes
);
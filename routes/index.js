
exports.index = function( req, res ){
  res.render( 'index', {title: 'Monument', bg: req.params.bg || ''} )
}
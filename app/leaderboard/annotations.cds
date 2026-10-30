using AdminService as service from '../../srv/admin-service';

annotate service.GameLeaderboard with @(
  UI.HeaderInfo          : { TypeName: 'Game', TypeNamePlural: 'Top games', Title: { Value: title } },
  UI.LineItem            : [
    { Value: title, Label: 'Game' },
    { $Type: 'UI.DataFieldForAnnotation', Target: '@UI.DataPoint#rating', Label: 'Gemiddelde rating', ![@HTML5.CssDefaults]: { width: '10rem' } },
    { Value: reviewCount, Label: 'Aantal reviews' }
  ],
  UI.DataPoint #rating   : { Value: avgRating, Visualization: #Rating, TargetValue: 5 },
  // Standaard gesorteerd: hoogste rating eerst, bij gelijkstand de meeste reviews
  UI.PresentationVariant : {
    SortOrder      : [ { Property: avgRating, Descending: true }, { Property: reviewCount, Descending: true } ],
    Visualizations : [ '@UI.LineItem' ]
  }
);

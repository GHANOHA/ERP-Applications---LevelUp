using AdminService as service from '../../srv/admin-service';

// =====================================================================
// Lijst (List Report)
// =====================================================================
annotate service.Games with @(
  UI.HeaderInfo      : {
    TypeName       : 'Game',
    TypeNamePlural : 'Games',
    Title          : { Value: title },
    Description    : { Value: genre.name }
  },
  UI.SelectionFields : [ genre_code, platform_code, releaseDate ],
  UI.LineItem        : [
    { Value: title,         Label: 'Titel' },
    { Value: genre_code,    Label: 'Genre' },
    { Value: platform_code, Label: 'Platform' },
    { Value: price,         Label: 'Prijs' },
    { Value: stock,         Label: 'Voorraad', Criticality: stockCriticality },
    { Value: releaseDate,   Label: 'Release' }
  ]
);

// =====================================================================
// Detail (Object Page): secties (Facets) met veldgroepen
// =====================================================================
annotate service.Games with @(
  UI.FieldGroup #Algemeen : { Data: [
    { Value: title },
    { Value: genre_code },
    { Value: platform_code },
    { Value: studioCountry_code },
    { Value: releaseDate },
    { Value: description }
  ]},
  UI.FieldGroup #Verkoop  : { Data: [
    { Value: price },
    { Value: currency_code },
    { Value: stock, Criticality: stockCriticality }
  ]},
  UI.Facets               : [
    { $Type: 'UI.ReferenceFacet', ID: 'Algemeen', Label: 'Algemeen',          Target: '@UI.FieldGroup#Algemeen' },
    { $Type: 'UI.ReferenceFacet', ID: 'Verkoop',  Label: 'Prijs en voorraad', Target: '@UI.FieldGroup#Verkoop' },
    { $Type: 'UI.ReferenceFacet', ID: 'Reviews',  Label: 'Reviews',           Target: 'reviews/@UI.LineItem' }
  ]
);

// =====================================================================
// Labels en tekst i.p.v. code (value help komt automatisch van de code list)
// =====================================================================
annotate service.Games with {
  title         @title: 'Titel';
  description   @title: 'Beschrijving' @UI.MultiLineText;
  genre         @title: 'Genre'    @Common.Text: genre.name    @Common.TextArrangement: #TextOnly;
  platform      @title: 'Platform' @Common.Text: platform.name @Common.TextArrangement: #TextOnly;
  price         @title: 'Prijs';
  stock         @title: 'Voorraad';
  releaseDate   @title: 'Releasedatum';
  studioCountry @title: 'Land studio';
};

// Reviews als tabel op de detailpagina
annotate service.Reviews with @(
  UI.LineItem : [
    { Value: rating,             Label: 'Rating' },
    { Value: comment,            Label: 'Commentaar' },
    { Value: customer.firstName, Label: 'Klant' },
    { Value: createdAt,          Label: 'Datum' }
  ]
);

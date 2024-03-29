import DS from 'ember-data';

export default DS.Model.extend({
  name:             DS.attr('string'),
  phoneNumber:      DS.attr('string'),
  email:            DS.attr('string'),
  role:             DS.attr('string'),
  subscribesToNews: DS.attr('boolean'),
  password:         DS.attr('string'),
  passwordConfirm:  DS.attr('string'),
  createdAt:        DS.attr('date'),
  updatedAt:        DS.attr('date')
});

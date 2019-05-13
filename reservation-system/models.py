from app import db
class Users(db.Model):
    __tablename__='users'

    username = db.Column(db.String(), primary_key=True)
    password = db.Column(db.String())
    computer_ID = db.Column(db.Integer)
    email = db.Column(db.String())

    def serialize(self):
        return {
            'username': self.username,
            'password': self.password,
            'computer_ID': self.computer_ID,
            'email': self.email,

        }

    def __repr__(self):
        return 'Users'+str(self.serialize())

class Computers(db.Model):
    __tablename__='computers'

    computer_ID = db.Column(db.Integer, primary_key=True)
    availability = db.Column(db.Integer)
    checkout_time = db.Column(db.Integer)
    reservation_end_time = db.Column(db.Integer)

    def serialize(self):
        return{
            'computer_ID': self.computer_ID,
            'availability': self.availability,
            'checkout_time': self.checkout_time,
            'reservation_end_time': self.reservation_end_time,

        }

    def __repr__(self):
        return 'Computers'+str(self.serialize())                                 

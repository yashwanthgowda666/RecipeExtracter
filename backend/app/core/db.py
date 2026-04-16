from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

# If we use sqlite, we need this extra setting for threads.
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

# setup the connection engine
engine = create_engine(
    settings.DATABASE_URL, connect_args=connect_args
)

# this creates a factory for database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# we use this as a base for all our models
Base = declarative_base()

# helper function to get a db session during a request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        # always close the connection when done!
        db.close()

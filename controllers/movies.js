const BadRequestErr = require('../errors/BadRequestErr');
const ConflictErr = require('../errors/ConflictErr');
const NotFoundErr = require('../errors/NotFoundErr');
const Movie = require('../models/movie');
const ForbiddenErr = require('../errors/ForbiddenErr');

const getMovies = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const movies = await Movie.find({ owner: ownerId });

    res.status(200).send(movies);
  } catch (error) {
    next(error);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    } = req.body;
    const movie = await Movie.create({
      owner: ownerId,
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    });
    res.status(200).send(movie);
  } catch (error) {
    if (error.code === 11000) {
      next(new ConflictErr('Такой фильм уже существует'));
    } else if (error.name === 'ValidationError') {
      next(new BadRequestErr('Неверные данные для создания фильма'));
    } else {
      next(error);
    }
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      next(new NotFoundErr('Фильм не найден'));
      return;
    }

    if (ownerId.toString() === movie.owner.toString()) {
      const deletedMovie = await Movie.findByIdAndDelete(movieId);
      res.status(200).send(deletedMovie);
    } else {
      next(new ForbiddenErr('Недостаточно прав для удаления фильма'));
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestErr('Невозможно удалить фильм'));
    } else {
      next(error);
    }
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};

# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.31

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:

#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:

# Disable VCS-based implicit rules.
% : %,v

# Disable VCS-based implicit rules.
% : RCS/%

# Disable VCS-based implicit rules.
% : RCS/%,v

# Disable VCS-based implicit rules.
% : SCCS/s.%

# Disable VCS-based implicit rules.
% : s.%

.SUFFIXES: .hpux_make_needs_suffix_list

# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

#Suppress display of executed commands.
$(VERBOSE).SILENT:

# A target that is always out of date.
cmake_force:
.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/bin/cmake

# The command to remove a file.
RM = /usr/bin/cmake -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /home/Sles/pr/pico/sd_card_reader/build/_deps/picotool-src

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /home/Sles/pr/pico/sd_card_reader/build/_deps/picotool-build

# Include any dependencies generated for this target.
include errors/CMakeFiles/errors.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include errors/CMakeFiles/errors.dir/compiler_depend.make

# Include the compile flags for this target's objects.
include errors/CMakeFiles/errors.dir/flags.make

errors/CMakeFiles/errors.dir/codegen:
.PHONY : errors/CMakeFiles/errors.dir/codegen

errors/CMakeFiles/errors.dir/errors.cpp.o: errors/CMakeFiles/errors.dir/flags.make
errors/CMakeFiles/errors.dir/errors.cpp.o: /home/Sles/pr/pico/sd_card_reader/build/_deps/picotool-src/errors/errors.cpp
errors/CMakeFiles/errors.dir/errors.cpp.o: errors/CMakeFiles/errors.dir/compiler_depend.ts
	cd /home/Sles/pr/pico/sd_card_reader/build/_deps/picotool-build/errors && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT errors/CMakeFiles/errors.dir/errors.cpp.o -MF CMakeFiles/errors.dir/errors.cpp.o.d -o CMakeFiles/errors.dir/errors.cpp.o -c /home/Sles/pr/pico/sd_card_reader/build/_deps/picotool-src/errors/errors.cpp

errors/CMakeFiles/errors.dir/errors.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Preprocessing CXX source to CMakeFiles/errors.dir/errors.cpp.i"
	cd /home/Sles/pr/pico/sd_card_reader/build/_deps/picotool-build/errors && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/Sles/pr/pico/sd_card_reader/build/_deps/picotool-src/errors/errors.cpp > CMakeFiles/errors.dir/errors.cpp.i

errors/CMakeFiles/errors.dir/errors.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color "--switch=$(COLOR)" --green "Compiling CXX source to assembly CMakeFiles/errors.dir/errors.cpp.s"
	cd /home/Sles/pr/pico/sd_card_reader/build/_deps/picotool-build/errors && /usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/Sles/pr/pico/sd_card_reader/build/_deps/picotool-src/errors/errors.cpp -o CMakeFiles/errors.dir/errors.cpp.s

# Object files for target errors
errors_OBJECTS = \
"CMakeFiles/errors.dir/errors.cpp.o"

# External object files for target errors
errors_EXTERNAL_OBJECTS =

errors/liberrors.a: errors/CMakeFiles/errors.dir/errors.cpp.o
errors/liberrors.a: errors/CMakeFiles/errors.dir/build.make
errors/liberrors.a: errors/CMakeFiles/errors.dir/link.txt
	cd /home/Sles/pr/pico/sd_card_reader/build/_deps/picotool-build/errors && $(CMAKE_COMMAND) -P CMakeFiles/errors.dir/cmake_clean_target.cmake
	cd /home/Sles/pr/pico/sd_card_reader/build/_deps/picotool-build/errors && $(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/errors.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
errors/CMakeFiles/errors.dir/build: errors/liberrors.a
.PHONY : errors/CMakeFiles/errors.dir/build

errors/CMakeFiles/errors.dir/clean:
	cd /home/Sles/pr/pico/sd_card_reader/build/_deps/picotool-build/errors && $(CMAKE_COMMAND) -P CMakeFiles/errors.dir/cmake_clean.cmake
.PHONY : errors/CMakeFiles/errors.dir/clean

errors/CMakeFiles/errors.dir/depend:
	cd /home/Sles/pr/pico/sd_card_reader/build/_deps/picotool-build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/Sles/pr/pico/sd_card_reader/build/_deps/picotool-src /home/Sles/pr/pico/sd_card_reader/build/_deps/picotool-src/errors /home/Sles/pr/pico/sd_card_reader/build/_deps/picotool-build /home/Sles/pr/pico/sd_card_reader/build/_deps/picotool-build/errors /home/Sles/pr/pico/sd_card_reader/build/_deps/picotool-build/errors/CMakeFiles/errors.dir/DependInfo.cmake "--color=$(COLOR)"
.PHONY : errors/CMakeFiles/errors.dir/depend

